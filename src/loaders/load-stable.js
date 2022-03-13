import { makeUrl } from "../constances/path-to-models";


export const loadStable = (scene, gltfLoader, path) => {
  gltfLoader.load(
    makeUrl(path),
    (gltf) => {
      console.log(`${path} => `, gltf.scene.children)
      const stable = gltf.scene;
      stable.position.x = -199
      stable.position.z = 47.5
      stable.position.y = 4.2
      

      scene.add(stable);
    }
  )
}