import * as THREE from 'three'
import { makeUrl } from "../constances/path-to-models";
import { randomizeMatrix } from '../constances/randomizeMatrix';
import { treeData } from '../constances/tree-positions';

let trees;
export const loadTreesLOD = (scene, gltfLoader, path) => {
  gltfLoader.load(
    makeUrl(path),
    (gltf) => {
      console.log('load trees')
      trees = gltf.scene.children;
      addTreesToScene(gltf.scene, scene)
    }
  )
}


const addTreesToScene = (treesParent, scene) => {
  const meshes = []
  for (let i = 0; i < trees.length; i++) {
    const tree = treesParent.getObjectByName(`Tree_0${i + 1}`);
    const _treeMesh1 = tree.children[0];
    const _treeMesh2 = tree.children[1];
    const geo1 = _treeMesh1.geometry;
    const mat1 = _treeMesh1.material;
    const geo2 = _treeMesh2.geometry;
    const mat2 = _treeMesh2.material;
    meshes[i] = { geo1, mat1, geo2, mat2 }
  }

  for (let i = 0; i < treeData.length; i++) {
    const matrix = new THREE.Matrix4();
    randomizeMatrix(matrix, treeData[i], i);
    const lod = new THREE.LOD();
    for (let i = 0; i < trees.length; i++) {
      const mesh1 = new THREE.Mesh(meshes[i].geo1, meshes[i].mat1)
      const mesh2 = new THREE.Mesh(meshes[i].geo2, meshes[i].mat2)
      const group = new THREE.Group();
      group.add(mesh1, mesh2)
      lod.addLevel(group, i * 20)
    }
    lod.applyMatrix4(matrix)
    lod.updateMatrix();
    lod.matrixAutoUpdate = false;
    scene.add(lod)
  }
}
