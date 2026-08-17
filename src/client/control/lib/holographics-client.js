import { Socket } from "holographics-client-sdk"
const Holographics = new Socket(window.location.origin)
window.Holographics = Holographics

export default Holographics
