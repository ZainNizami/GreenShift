import requests

def get_affordable_units():
    base_url = "https://ckan0.cf.opendata.inter.prod-toronto.ca"
    package_url = f"{base_url}/api/3/action/package_show"
    params = { "id": "upcoming-and-recently-completed-affordable-housing-units" }

    response = requests.get(package_url, params=params)
    package = response.json()

    results = []

    for resource in package["result"]["resources"]:
        if resource.get("datastore_active"):
            search_url = f"{base_url}/api/3/action/datastore_search"
            search_params = { "id": resource["id"], "limit": 1000 }  # increase limit as needed
            search_response = requests.get(search_url, params=search_params).json()
            records = search_response["result"]["records"]
            results.extend(records)

    return results
