import requests

def get_active_building_permits():
    base_url = "https://ckan0.cf.opendata.inter.prod-toronto.ca"
    package_url = f"{base_url}/api/3/action/package_show"
    params = { "id": "building-permits-active-permits" }

    response = requests.get(package_url, params=params)
    package = response.json()

    permits = []

    for resource in package["result"]["resources"]:
        if resource.get("datastore_active"):
            search_url = f"{base_url}/api/3/action/datastore_search"
            search_params = { "id": resource["id"], "limit": 1000 }  # adjust limit if needed
            search_response = requests.get(search_url, params=search_params).json()
            records = search_response["result"]["records"]
            permits.extend(records)

    return permits
