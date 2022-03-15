import * as THREE from 'three'
import { makeUrl } from "../constances/path-to-models";
import { SkeletonUtils } from 'three/examples/jsm/utils/SkeletonUtils';
import { randomNumber, randomRangeWithoutOverlap } from '../constances/functions';

// 


const count = 9;
const usedPostion = randomRangeWithoutOverlap({ x: -230, y: 0, z: 0 }, { x: -215, y: 0, z: 15 }, count, 2);
console.log(usedPostion)

export const loadGoatModel = (scene, gltfLoader, path, mixers) => {
  gltfLoader.load(
    makeUrl(path),
    (gltf) => {
      console.log(`${path} => `, gltf)
      for (let i = 0; i < count; i++) {
        console.log('add goat')
        const model = SkeletonUtils.clone(gltf.scene);

        const mixer = new THREE.AnimationMixer(model);

        setTimeout(() => {
          mixer.clipAction(gltf.animations[2]).play(); // idle
        }, Math.random() * 5000);
        mixer.timeScale = randomNumber(0.5, 1);

        model.position.x = usedPostion[i].x
        model.position.y = -0.01;
        model.position.z = usedPostion[i].z

        model.rotation.y = Math.random() * Math.PI

        scene.add(model);
        mixers.push(mixer);
      }

    }
  )
}

// const addToScene = (scene, mixers) => {

//   for (let i = 0; i < generateRandomPostion.length; i++) {
//     const position = generateRandomPostion[i];
//     console.log(model, modelScene, position)
//     model.position.set(position.x, position.y, position.z)
//     const cloneModel = model.clone();
//     scene.add(cloneModel);
//     const mixer = new THREE.AnimationMixer(cloneModel);
//     mixers.push(mixer)
//     mixer.clipAction(modelScene.animations[parseInt(Math.random() * 4) + 1]).play();
//   }
// }

