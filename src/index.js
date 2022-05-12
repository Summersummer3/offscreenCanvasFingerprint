import osc from './fingerprint'
import WebWorker from './worker'

const worker = new WebWorker(osc)

export default worker