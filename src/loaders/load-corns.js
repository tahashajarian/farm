import * as THREE from 'three'
// import { cornPositions } from '../constances/corn-positions';
import { makeUrl } from "../constances/path-to-models";
// import { randomizeMatrix } from '../constances/randomizeMatrix';

let corns;

const cornSize = 10
const cornSize1 = 20;
export const loadCornsLOD = (scene, gltfLoader, path) => {

    gltfLoader.load(
        makeUrl(path),
        (gltf) => {
            console.log('load corns')
            corns = gltf.scene.children;
            addCornsToScene(gltf.scene, scene);
        }
    )

}


const addCornsToScene = (cornsParent, scene) => {
    const meshes = []
    for (let i = 0; i < corns.length; i++) {
        const corn = cornsParent.getObjectByName(`cornfbx_0${i + 1}`);
        const geo = corn.geometry;
        const mat = corn.material;
        meshes[i] = { geo, mat }
    }

    for (let i = 0; i < cornSize1; i++) {
        // console.log(corns)
        const matrix = new THREE.Matrix4();
        randomizeMatrix(matrix, i);
        const lod = new THREE.LOD();
        for (let i = 0; i < corns.length; i++) {
            // const corn = cornsParent.getObjectByName(`corn0${i + 1}`);

            // const geo1 = corn.geometry;
            // const mat1 = corn.material;

            const mesh = new THREE.Mesh(meshes[i].geo, meshes[i].mat)



            lod.addLevel(mesh, i * 20)
        }
        lod.applyMatrix4(matrix)
        lod.updateMatrix();
        lod.matrixAutoUpdate = false;
        scene.add(lod)
    }

    for (let i = 0; i < cornSize; i++) {
        // console.log(corns)
        const matrix = new THREE.Matrix4();
        randomizeMatrix2(matrix, i);
        const lod = new THREE.LOD();
        for (let i = 0; i < corns.length; i++) {
            // const corn = cornsParent.getObjectByName(`corn0${i + 1}`);

            // const geo1 = corn.geometry;
            // const mat1 = corn.material;

            const mesh = new THREE.Mesh(meshes[i].geo, meshes[i].mat)



            lod.addLevel(mesh, i * 20)
        }
        lod.applyMatrix4(matrix)
        lod.updateMatrix();
        lod.matrixAutoUpdate = false;
        scene.add(lod)
    }
}

const randomizeMatrix = (function () {
    const position = new THREE.Vector3();
    const rotation = new THREE.Euler();
    const quaternion = new THREE.Quaternion();
    const scale = new THREE.Vector3();

    return function (matrix, i) {
        // console.log(i)
        // console.log(position_)
        // console.log(position_)
        // position.x = position_.x;
        // position.z = position_.z;
        position.x = Math.random() * 168 + 80
        position.z = Math.random() * -323 + 75
        position.y = 0;

        rotation.x = 0;
        rotation.y = 0;
        rotation.z = 0;

        quaternion.setFromEuler(rotation);

        scale.x = scale.y = scale.z = 1;

        matrix.compose(position, quaternion, scale);
    };
})();


const randomizeMatrix2 = (function () {
    const position = new THREE.Vector3();
    const rotation = new THREE.Euler();
    const quaternion = new THREE.Quaternion();
    const scale = new THREE.Vector3();

    return function (matrix, i) {
        // console.log(i)
        // console.log(position_)
        // console.log(position_)
        // position.x = position_.x;
        // position.z = position_.z;
        position.x = Math.random() * -263 + 15
        position.z = Math.random() * -198 - 50
        position.y = 0;

        rotation.x = 0;
        rotation.y = 0;
        rotation.z = 0;

        quaternion.setFromEuler(rotation);

        scale.x = scale.y = scale.z = 1;

        matrix.compose(position, quaternion, scale);
    };
})();