import os
import requests
import re

import tidylib
from html_linter import lint
from urllib3 import HTTPSConnectionPool

REF_DIR = "../front/src/activities"


def search(search_dir=REF_DIR, pattern="content.html"):
    filenames = []
    for root, dirs, files in os.walk(search_dir):
        # pattern == exact matching (no regex!)
        filenames.extend([os.path.join(root, file) for file in files if file == pattern])

    print(f"Files to check ({len(filenames)}): {filenames}")
    return filenames


def check_error_relevance(error):
    """Remove not important warnings"""
    to_ignore = ["missing <!DOCTYPE> declaration",
                 "inserting implicit <body>",
                 "lacks value",
                 'proprietary attribute',
                 "inserting missing 'title' element",
                 'lacks "alt" attribute',
                 "escaping malformed URI reference",
                 "unescaped &"]
    for ignore_str in to_ignore:
        if ignore_str in error:
            return False
    return True


def advanced_relevance_check(errors):
    """Remove errors with <p>...</p> as they seem ok for web browsers."""
    if len(errors) != 2:
        return errors
    a = 0
    b = 0
    for error in errors:
        if a * b:
            break
        if "Warning: inserting implicit <p>" in error:
            a = 1
            continue
        if "Warning: trimming empty <p>" in error:
            b = 1
            continue
    if a * b:  # ignore errors
        return []
    return errors


def check_content(file, html_text):
    # print(f"HTML FILE: {file}")
    lint(html_text)
    tidylib.BASE_OPTIONS = {}
    document, errors = tidylib.tidy_document(html_text,
                                             options={"show-warnings": True})
    # manual filter (as it doesn't exist as is !!)
    errors = [error for error in errors.split("\n") if check_error_relevance(error) and error]
    errors = advanced_relevance_check(errors)
    if errors:
        formatted_errors = "\n".join(errors)
        print(f"HTML errors in file {file}:\n{formatted_errors}")
    sources = re.findall(r'src=".+?"', html_text)
    for raw_source in sources:
        source = raw_source[5:-1]
        if source.startswith("http") or source.startswith("www"):
            continue  # comment this line to check online content
            try:
                # WARN: may be long and unsecured !
                res = requests.get(source)
            except (HTTPSConnectionPool, ConnectionResetError) as err:
                print(f"Error while getting resource {source} in file {file}: {err}")
                continue
            if not (200 <= res.status_code < 300):
                print(f"Resource '{source}' not found! It may not exist, but is referenced in file {file}")
            continue
        if re.findall(r'\s', source):
            print(f"Filename with whitespaces: {source} in file {file}")
        if not os.path.isfile(os.path.join(os.path.dirname(file), source)):
            print(f"File {source} doesn't exist in directory of {file}")


def main():
    for i, file in enumerate(search()):
        try:
            with open(file, "r") as fi:
                text = fi.read()
        except Exception as err:
            print(f"Impossible to load file n°{i} '{file}'. Error: {err}")
            continue

        try:
            check_content(file, text)
        except Exception as err:
            print(f"Critical exception for file '{file}': {err}")
    print("Lint terminated, but no correction done! See messages below to correct them manually.")


if __name__ == '__main__':
    main()
