import { makeUrl } from "../constances/path-to-models";


export const loadTerrain = (scene, gltfLoader, path) => {
  gltfLoader.load(
    makeUrl(path),
    (gltf) => {
      console.log(`${path} => `, gltf.scene.children)
      const terrain = gltf.scene.children[0];
      scene.add(terrain);
    }
  )
}