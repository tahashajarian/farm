import * as THREE from 'three'
import { makeUrl } from "../constances/path-to-models";
import { SkeletonUtils } from 'three/examples/jsm/utils/SkeletonUtils';
import { randomNumber } from '../constances/functions';
import { randomRangeWithoutOverlap } from '../constances/functions'
// 


const countCattle = 1;
const usedPostion = randomRangeWithoutOverlap({ x: -200, y: 0, z: -30 }, { x: -170, y: 0, z: 10 }, countCattle, 2.5);


export const loadCattleModel = (scene, gltfLoader, path, mixers) => {
  gltfLoader.load(
    makeUrl(path),
    (gltf) => {
      console.log(`${path} => `, gltf)
      for (let i = 0; i < usedPostion.length; i++) {

        const model = SkeletonUtils.clone(gltf.scene);

        const mixer = new THREE.AnimationMixer(model);

        setTimeout(() => {
          mixer.clipAction(gltf.animations[parseInt(randomNumber(0, 2))]).play(); // idleإإ
        }, Math.random() * 6000);
        // mixer.timeScale = Math.random();

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

