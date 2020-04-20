import json
import os

REF_DIR = "../front/src/activities"


def search(search_dir=REF_DIR, pattern="activity.json"):
    filenames = []
    for root, dirs, files in os.walk(search_dir):
        # pattern == exact matching (no regex!)
        filenames.extend([os.path.join(root, file) for file in files if file == pattern])

    print(f"Files to check ({len(filenames)}): {filenames}")
    return filenames


def check_progression(file, dico):
    mandatory_keys = ['id',
                      'idParcours',
                      'nom']
    accepted_keys = ['id', 'idParcours', 'nom', 'description', 'duree', 'materiel', 'difficulte', 'page']
    difficultes = ["facile", "moyen", "difficile"]
    # invalid keys
    to_pop = []
    to_update = []
    for key in dico:
        if key not in accepted_keys:
            if key == "pages":
                to_update.append({'page': int(dico['pages'])})
            if key == "idActivite":
                to_update.append({'id': str(dico['idActivite'])})
            if key == "difficulte":
                if dico["key"] not in difficultes:
                    print(f"Invalid difficulte {dico[key]} for file '{file}'")
            value = dico.get(key)
            to_pop.append(key)
            print(f"Found invalid key {key} with value {value} in '{file}'")
    for key in to_pop:
        dico.pop(key)
    for key in to_update:
        dico.update(key)
    for key in mandatory_keys:
        if key not in dico:
            dico[key] = str(dico[key])
            print(f"Mandatory key {key} is not in '{file}")


def main():
    for i, file in enumerate(search()):
        try:
            with open(file, "r") as fi:
                dico = json.load(fi)
        except Exception as err:
            print(f"Impossible to load file n°{i} '{file}'. Error: {err}")
            continue

        try:
            check_progression(file, dico)
        except Exception as err:
            print(f"Critical exception for file '{file}': {err}")
        else:
            with open(file, "w+", encoding="utf-8") as open_file:
                open_file.write(json.dumps(dico, indent=2, ensure_ascii=False))


if __name__ == '__main__':
    main()
