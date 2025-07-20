import requests

BASE_URL = "https://ckan0.cf.opendata.inter.prod-toronto.ca"

def get_neighbourhood_data():
    # Get package metadata
    package_url = f"{BASE_URL}/api/3/action/package_show"
    params = { "id": "neighbourhoods" }

    response = requests.get(package_url, params=params)
    if response.status_code != 200:
        raise Exception("Failed to fetch package metadata")

    package = response.json()
    resources = package["result"]["resources"]

    # Find the datastore_active resource
    for resource in resources:
        if resource["datastore_active"]:
            # Fetch the actual data
            search_url = f"{BASE_URL}/api/3/action/datastore_search"
            search_params = { "id": resource["id"], "limit": 1000 }

            search_response = requests.get(search_url, params=search_params)
            if search_response.status_code != 200:
                raise Exception("Failed to fetch resource data")

            data = search_response.json()
            return data["result"]["records"]

    raise Exception("No datastore_active resource found for neighbourhoods")
