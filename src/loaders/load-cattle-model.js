import * as THREE from 'three'
import { makeUrl } from "../constances/path-to-models";
import { SkeletonUtils } from 'three/examples/jsm/utils/SkeletonUtils';
import { randomNumber } from '../constances/functions';

// 

const usedPostion = [];
export const loadCattleModel = (scene, gltfLoader, path, mixers) => {
  gltfLoader.load(
    makeUrl(path),
    (gltf) => {
      console.log(`${path} => `, gltf)
      for (let i = 0; i < 50; i++) {

        const model = SkeletonUtils.clone(gltf.scene);

        const mixer = new THREE.AnimationMixer(model);

        mixer.clipAction(gltf.animations[parseInt(randomNumber(0, 2))]).play(); // idle
        mixer.timeScale = Math.random();

        model.position.x = randomNumber(-200, -170);
        model.position.y = -0.01;
        model.position.z = randomNumber(-30, 10);

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

