import json
import os
import ast

REF_DIR = "../front/src/activities"


def search(search_dir=REF_DIR, pattern="progression.json"):
    filenames = []
    for root, dirs, files in os.walk(search_dir):
        # pattern == exact matching (no regex!)
        filenames.extend([os.path.join(root, file) for file in files if file == pattern])

    print(f"Files to check ({len(filenames)}): {filenames}")
    return filenames


def check_progression(file, dico):
    mandatory_keys = ['idActivite',
                      'idParcours',
                      'duration']
    accepted_keys = ['idActivite',
                     'idParcours',
                     'commentaire',
                     'state',
                     'nom',
                     'duration',
                     'startedAt',
                     'finishedAt',
                     'reviewAt',
                     'entries']
    entry_keys = ['position',
                  'question',
                  'documents',
                  'typeRendu',
                  'rendu',
                  'state',
                  'tracked',
                  'page']
    type_rendus = ["text", "file", "qcm", "orderList"]

    # Get ids from path
    activity_dir = os.path.split(file)[0]
    parcours_dir, id_activity_file = os.path.split(activity_dir)
    id_parcours_file = os.path.split(parcours_dir)[1]
    # print(f"File: {id_parcours_file} / {id_activity_file}")

    # invalid keys
    to_pop = []
    for key in dico:
        if key not in accepted_keys:
            value = dico.get(key)
            to_pop.append(key)
            print(f"Found invalid key {key} with value {value} in '{file}'")
    for key in to_pop:
        dico.pop(key)
    for key in mandatory_keys:
        if key not in dico:
            print(f"Mandatory key {key} is not in '{file}")
    # todo: check duration type
    # check keys
    dico["idActivite"] = str(dico["idActivite"])
    dico["idParcours"] = str(dico["idParcours"])
    dico["state"] = "INPROGRESS"
    dico["startedAt"] = 0
    dico["finishedAt"] = 0
    dico["reviewAt"] = 0

    if dico["idActivite"] != id_activity_file:
        print(f"File {file} (idActivite: {id_activity_file})  has an incorrect id: {dico['idActivite']}!")
    if dico["idParcours"] != id_parcours_file:
        print(f"File {file} (idParcours: {id_parcours_file}) has an incorrect idParcours: {dico['idParcours']}!")

    if "entries" in dico:
        if not isinstance(dico["entries"], list):
            print(f"Invalid entries type for file '{file}'")
            return
        positions =set()
        to_pop = []
        to_update = []
        for entry in dico["entries"]:
            for key in entry:
                if key == "rendu":
                    if entry["typeRendu"].lower() == "orderlist":
                        # print(f"ORDERLIST: {file}. Rendu: {entry[key]}")
                        if isinstance(entry[key], str):  # try to convert to Python list before json.dumps
                            entry[key] = ast.literal_eval(entry[key])
                        if not isinstance(entry[key], list):
                            print(f"OrderList has a bad type: {type(entry[key])}. CANNOT CONVERT AUTOMATICALLY")
                        entry[key] = json.dumps(entry[key], ensure_ascii=False)
                        # print(f"changed to {entry[key]}")
                    elif entry["typeRendu"].lower() == "qcm":
                        # print(f"QCM: {file}. Rendu: {entry[key]}")
                        _old = entry[key]
                        if isinstance(entry[key], str):  # try to convert to Python list before json.dumps
                            entry[key] = ast.literal_eval(entry[key].replace("false", "False"))
                        assert isinstance(entry[key], list), "qcm not a list"
                        for question_dict in entry[key]:
                            assert set(question_dict) == {"question", "reponses"}, "bad keys for qcm"
                            question_dict["reponses"] = {k: False for k in question_dict["reponses"]}
                        entry[key] = json.dumps(entry[key], ensure_ascii=False)
                        if _old != entry[key]:
                            print(f"QCM changed from {_old} to {entry[key]}")
                        # print(f"changed to {entry[key]}")
                    else:
                        entry[key] = str(entry[key])
                    # print(f"Rendu must be str in file '{file}'")
                if key not in entry_keys:
                    if key == "id":
                        to_update.append({"position": int(entry['id'])})
                    value = entry.get(key)
                    to_pop.append(key)
                    print(f"Found invalid key {key} with value {value} in entry of '{file}'")
            entry["state"] = "NOTSTARTED"
            entry["position"] = int(entry["position"])
            if entry["position"] in positions:
                print(f"Position field must be unique in progression {file}")
            positions.add(entry["position"])
            if not entry["typeRendu"] in type_rendus:
                print(f"typeRendu {entry['typeRendu']} incorrect for file '{file}'!")
            for key in to_pop:
                entry.pop(key)
            for key in to_update:
                entry.update(key)
    # todo: check types


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
