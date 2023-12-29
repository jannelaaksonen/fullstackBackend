import axios from "axios";
const baseUrl = 'https://cloud.mongodb.com/v2/658bd18a7142f07ece0ac399#/metrics/replicaSet/658bd7105d9af6265d041eae/explorer/puhelinluettelo/people/find';

const getAll = () => {
    return axios.get(baseUrl)
}

const create = newObject => {
    return axios.post(baseUrl, newObject)
}

const remove = id => {
    return axios.delete(`${baseUrl}/${id}`)
}

const update = (id, newObject) => {
    return axios.put(`${baseUrl}/${id}`, newObject)
}

export default {getAll, create, remove, update}