import React,{useEffect, useRef} from 'react'
import * as THREE from 'three';
import {  useThree } from '@react-three/fiber'
import {OrbitControls, useGLTF,useTexture,useAnimations } from '@react-three/drei'
import { normalMap, texture } from 'three/tsl';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger';


const Dog = () => {
  
  gsap.registerPlugin(useGSAP,ScrollTrigger);


   
  const model = useGLTF("/models/dog.drc.glb");

  // set the camera position
   useThree(({camera,scene,gl})=>{
    camera.position.z = 0.6;

    //set the tone mapping and color space cause by default the webGL/renderer set the color to worst tone and we need it to be better quality coor tone
    gl.toneMapping = THREE.ReinhardToneMapping;
    gl.outputColorSpace = THREE.SRGBColorSpace
   })


  //for running the animation we use useAnimations and it return "actions" and then use it inside the useEffect
  const { actions } = useAnimations(model.animations,model.scene);

  useEffect(()=>{
    actions["Take 001"].play()
  },[actions])


  //use the destructure and make the texture better quality
  const [
    normalMap
  ] = (useTexture(["/dog_normals.jpg"])).map((texture)=>{
    texture.flipY = false;
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  })


  const [  branchMap,
  branchNormalMap] = (useTexture(["/branches_normals.jpg","/branches_diffuse.jpg"])).map((texture)=>{
    texture.flipY = true;
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  })




  //select all the texture colour of the dog here and make it better quality
  const  [ mat1,mat2,mat3,mat4,mat5,mat6,mat7,mat8,mat9,mat10,mat11,mat12,mat13,mat14,mat15,mat16,mat17,mat18,mat19,mat20] = (useTexture([
    "/matcap/mat-1.png",
    "/matcap/mat-2.png",
    "/matcap/mat-3.png",
    "/matcap/mat-4.png",
    "/matcap/mat-5.png",
    "/matcap/mat-6.png",
    "/matcap/mat-7.png",
    "/matcap/mat-8.png",
    "/matcap/mat-9.png",
    "/matcap/mat-10.png",
    "/matcap/mat-11.png",
    "/matcap/mat-12.png",
    "/matcap/mat-13.png",
    "/matcap/mat-14.png",
    "/matcap/mat-15.png",
    "/matcap/mat-16.png",
    "/matcap/mat-17.png",
    "/matcap/mat-18.png",
    "/matcap/mat-19.png",
    "/matcap/mat-20.png",
  ])).map((texture)=>{
    texture.flipY = true;
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  })

  //use the ref through which the colour mixing and expanding is happeing using the uProgress
  const material = useRef({
    uMatcap1: {value: mat19},
    uMatcap2: {value: mat2},
    uProgress: {value: 1.0}
  })

  //branch material ref - same as dog material to keep them synchronized
  const branchMaterialRef = useRef({
    uMatcap1: {value: mat19},
    uMatcap2: {value: mat2},
    uProgress: {value: 1.0}
  })
 
  const dogMaterial = new THREE.MeshMatcapMaterial({
        normalMap: normalMap,
        matcap: mat2
  })

  const branchMaterial = new THREE.MeshMatcapMaterial({
    normalMap: branchMap,
    matcap: branchNormalMap
  })


  //onBeforeCompile is a function that is called before the shader is compiled and using the fragment shader we can mix the two textures
  function onBeforeCompile(shader) {
        shader.uniforms.uMatcapTexture1 = material.current.uMatcap1
        shader.uniforms.uMatcapTexture2 = material.current.uMatcap2
        shader.uniforms.uProgress = material.current.uProgress

        // Store reference to shader uniforms for GSAP animation

        shader.fragmentShader = shader.fragmentShader.replace(
            "void main() {",
            `
        uniform sampler2D uMatcapTexture1;
        uniform sampler2D uMatcapTexture2;
        uniform float uProgress;

        void main() {
        `
        )

        shader.fragmentShader = shader.fragmentShader.replace(
            "vec4 matcapColor = texture2D( matcap, uv );",
            `
          vec4 matcapColor1 = texture2D( uMatcapTexture1, uv );
          vec4 matcapColor2 = texture2D( uMatcapTexture2, uv );
          float transitionFactor  = 0.2;
          
          float progress = smoothstep(uProgress - transitionFactor,uProgress, (vViewPosition.x+vViewPosition.y)*0.5 + 0.5);

          vec4 matcapColor = mix(matcapColor2, matcapColor1, progress );
        `
        )
    }

  //onBeforeCompile for branch material - same logic as dog
  function onBeforeCompileBranch(shader) {
        shader.uniforms.uMatcapTexture1 = branchMaterialRef.current.uMatcap1
        shader.uniforms.uMatcapTexture2 = branchMaterialRef.current.uMatcap2
        shader.uniforms.uProgress = branchMaterialRef.current.uProgress

        shader.fragmentShader = shader.fragmentShader.replace(
            "void main() {",
            `
        uniform sampler2D uMatcapTexture1;
        uniform sampler2D uMatcapTexture2;
        uniform float uProgress;

        void main() {
        `
        )

        shader.fragmentShader = shader.fragmentShader.replace(
            "vec4 matcapColor = texture2D( matcap, uv );",
            `
          vec4 matcapColor1 = texture2D( uMatcapTexture1, uv );
          vec4 matcapColor2 = texture2D( uMatcapTexture2, uv );
          float transitionFactor  = 0.2;
          
          float progress = smoothstep(uProgress - transitionFactor,uProgress, (vViewPosition.x+vViewPosition.y)*0.5 + 0.5);

          vec4 matcapColor = mix(matcapColor2, matcapColor1, progress );
        `
        )
    }

  dogMaterial.onBeforeCompile = onBeforeCompile;
  branchMaterial.onBeforeCompile = onBeforeCompileBranch;

  

  //apply the normal map to the dog model only
  model.scene.traverse((child)=>{
    if(child.name.includes("DOG")){
      child.material =  dogMaterial;
    }else{
      child.material = branchMaterial;
    }
  }) 

  
  //gsap animation
  const dogModel = useRef(model) //select the model using the useRef


  useGSAP(()=>{
    const tl = gsap.timeline({
      scrollTrigger : {
        trigger : "#section-1",
        endTrigger : "#section-4",
        start : "top top",
        end: "bottom bottom",
        scrub: true
      }
    })

    //on scroll we push the model back in z position
    tl.to(dogModel.current.scene.position,{
      z: "-=0.5",
      y: "+=0.1"
    })
    .to(dogModel.current.scene.rotation,{
       x: `+=${Math.PI/6}`
    })
    .to(dogModel.current.scene.rotation,{
      y: `-=${Math.PI}`
    },"third")
    .to(dogModel.current.scene.position,{
      x: "-=0.4",
      z: "+=0.22",
      y: "-=0.1"
    },"third")
  },[])




 //dog fur changing on hover
  useEffect(()=>{
    document.querySelector(`.title[img-title="tommorowland"]`).addEventListener('mouseenter',()=>{
      
      material.current.uMatcap1.value = mat19;
      branchMaterialRef.current.uMatcap1.value = mat19;

      gsap.to(material.current.uProgress,{
        value : 0.0,
        duration : 0.8,
        ease : "power2.out",
        onComplete:()=>{
          material.current.uMatcap2.value = material.current.uMatcap1.value;
          material.current.uProgress.value = 1.0 
        }
      })

      gsap.to(branchMaterialRef.current.uProgress,{
        value : 0.0,
        duration : 0.8,
        ease : "power2.out",
        onComplete:()=>{
          branchMaterialRef.current.uMatcap2.value = branchMaterialRef.current.uMatcap1.value;
          branchMaterialRef.current.uProgress.value = 1.0 
        }
      })
    })

     document.querySelector(`.title[img-title="navy-pier"]`).addEventListener('mouseenter',()=>{

      material.current.uMatcap1.value = mat8;
      branchMaterialRef.current.uMatcap1.value = mat8;

      gsap.to(material.current.uProgress,{
        value : 0.0,
        duration : 0.8,
        ease : "power2.out",
        onComplete:()=>{
          material.current.uMatcap2.value = material.current.uMatcap1.value;
          material.current.uProgress.value = 1.0 
        }
      })

      gsap.to(branchMaterialRef.current.uProgress,{
        value : 0.0,
        duration : 0.8,
        ease : "power2.out",
        onComplete:()=>{
          branchMaterialRef.current.uMatcap2.value = branchMaterialRef.current.uMatcap1.value;
          branchMaterialRef.current.uProgress.value = 1.0 
        }
      })
    })

     document.querySelector(`.title[img-title="msi-chicago"]`).addEventListener('mouseenter',()=>{

      material.current.uMatcap1.value = mat9;
      branchMaterialRef.current.uMatcap1.value = mat9;

      gsap.to(material.current.uProgress,{
        value : 0.0,
        duration : 0.8,
        ease : "power2.out",
        onComplete:()=>{
          material.current.uMatcap2.value = material.current.uMatcap1.value;
          material.current.uProgress.value = 1.0 
        }
      })

      gsap.to(branchMaterialRef.current.uProgress,{
        value : 0.0,
        duration : 0.8,
        ease : "power2.out",
        onComplete:()=>{
          branchMaterialRef.current.uMatcap2.value = branchMaterialRef.current.uMatcap1.value;
          branchMaterialRef.current.uProgress.value = 1.0 
        }
      })
    })

     document.querySelector(`.title[img-title="phone"]`).addEventListener('mouseenter',()=>{

      material.current.uMatcap1.value = mat12;
      branchMaterialRef.current.uMatcap1.value = mat12;

      gsap.to(material.current.uProgress,{
        value : 0.0,
        duration : 0.8,
        ease : "power2.out",
        onComplete:()=>{
          material.current.uMatcap2.value = material.current.uMatcap1.value;
          material.current.uProgress.value = 1.0 
        }
      })

      gsap.to(branchMaterialRef.current.uProgress,{
        value : 0.0,
        duration : 0.8,
        ease : "power2.out",
        onComplete:()=>{
          branchMaterialRef.current.uMatcap2.value = branchMaterialRef.current.uMatcap1.value;
          branchMaterialRef.current.uProgress.value = 1.0 
        }
      })
    })


     document.querySelector(`.title[img-title="kikk"]`).addEventListener('mouseenter',()=>{

      material.current.uMatcap1.value = mat10;
      branchMaterialRef.current.uMatcap1.value = mat10;

      gsap.to(material.current.uProgress,{
        value : 0.0,
        duration : 0.8,
        ease : "power2.out",
        onComplete:()=>{
          material.current.uMatcap2.value = material.current.uMatcap1.value;
          material.current.uProgress.value = 1.0 
        }
      })

      gsap.to(branchMaterialRef.current.uProgress,{
        value : 0.0,
        duration : 0.8,
        ease : "power2.out",
        onComplete:()=>{
          branchMaterialRef.current.uMatcap2.value = branchMaterialRef.current.uMatcap1.value;
          branchMaterialRef.current.uProgress.value = 1.0 
        }
      })
    })

     document.querySelector(`.title[img-title="kennedy"]`).addEventListener('mouseenter',()=>{

      material.current.uMatcap1.value = mat8;
      branchMaterialRef.current.uMatcap1.value = mat8;

      gsap.to(material.current.uProgress,{
        value : 0.0,
        duration : 0.8,
        ease : "power2.out",
        onComplete:()=>{
          material.current.uMatcap2.value = material.current.uMatcap1.value;
          material.current.uProgress.value = 1.0 
        }
      })

      gsap.to(branchMaterialRef.current.uProgress,{
        value : 0.0,
        duration : 0.8,
        ease : "power2.out",
        onComplete:()=>{
          branchMaterialRef.current.uMatcap2.value = branchMaterialRef.current.uMatcap1.value;
          branchMaterialRef.current.uProgress.value = 1.0 
        }
      })
    })

    document.querySelector(`.title[img-title="opera"]`).addEventListener('mouseenter',()=>{

      material.current.uMatcap1.value = mat13;
      branchMaterialRef.current.uMatcap1.value = mat13;

      gsap.to(material.current.uProgress,{
        value : 0.0,
        duration : 0.8,
        ease : "power2.out",
        onComplete:()=>{
          material.current.uMatcap2.value = material.current.uMatcap1.value;
          material.current.uProgress.value = 1.0 
        }
      })

      gsap.to(branchMaterialRef.current.uProgress,{
        value : 0.0,
        duration : 0.8,
        ease : "power2.out",
        onComplete:()=>{
          branchMaterialRef.current.uMatcap2.value = branchMaterialRef.current.uMatcap1.value;
          branchMaterialRef.current.uProgress.value = 1.0 
        }
      })
    })


    document.querySelector(`.titles`).addEventListener('mouseleave',()=>{

      material.current.uMatcap1.value = mat2;
      branchMaterialRef.current.uMatcap1.value = mat2;

      gsap.to(material.current.uProgress,{
        value : 0.0,
        duration : 0.8,
        ease : "power2.out",
        onComplete:()=>{
          material.current.uMatcap2.value = material.current.uMatcap1.value;
          material.current.uProgress.value = 1.0 
        }
      })

      gsap.to(branchMaterialRef.current.uProgress,{
        value : 0.0,
        duration : 0.8,
        ease : "power2.out",
        onComplete:()=>{
          branchMaterialRef.current.uMatcap2.value = branchMaterialRef.current.uMatcap1.value;
          branchMaterialRef.current.uProgress.value = 1.0 
        }
      })
    })
  },[])
  
  return (
    <>
        <primitive object={model.scene} position={[0.20,-0.5,0]} rotation={[0,Math.PI/3.8,0]}/>

        <directionalLight color={0xffffff} intensity={10} position={[0,5,5]}/>
    </>
  )
}

export default Dog