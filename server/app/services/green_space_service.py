import requests

def get_green_space_data():
    base_url = "https://ckan0.cf.opendata.inter.prod-toronto.ca"
    url = base_url + "/api/3/action/package_show"
    params = {"id": "green-spaces"}
    package = requests.get(url, params=params).json()

    green_spaces = []

    for resource in package["result"]["resources"]:
        if resource.get("datastore_active"):
            search_url = base_url + "/api/3/action/datastore_search"
            p = {"id": resource["id"]}
            response = requests.get(search_url, params=p).json()
            records = response["result"]["records"]
            green_spaces.extend(records)

    return green_spaces
