// http://www.patrick-wied.at/blog/how-to-create-audio-visualizations-with-javascript-html
// https://soundcloud.com/nasa/sets/apollo-sounds

var scene, camera, renderer, cubes = [], cubeContainer;


        function init(){
            renderer = new THREE.WebGLRenderer({antialias: true});
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(window.devicePixelRatio);


            /*
                this adds the canvas to the dom
            */
            document.body.appendChild(renderer.domElement);



            scene = new THREE.Scene();

            camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1);

            camera.position.set(0, 6, -16);
            camera.lookAt(new THREE.Vector3(0, 0, 0));


            var geometry = new THREE.BoxGeometry( .1, .1, .1 );
            var material;


            var k;
            cubeContainer = new THREE.Object3D();
            for(k = 0; k < 1024; k++){
                material = new THREE.MeshLambertMaterial( {color: 0xff0000, shading: THREE.FlatShading, wireframe:false} );
                cube = new THREE.Mesh( geometry, material );
                cube.position.x = k*.1;
                cubeContainer.add( cube );

                cubes.push(cube);
            }

            cubeContainer.scale.set(.6,.6,.6);
            cubeContainer.position.x = -20;
            cubeContainer.rotation.y = -.3
            scene.add(cubeContainer);

            var light = new THREE.HemisphereLight(0x777777, 0x000000, 0.9);
            scene.add(light);

            ctx = new AudioContext();
            audio = document.getElementById('myAudio');
            audio.volume = .5;
            audioSrc = ctx.createMediaElementSource(audio);
            analyser = ctx.createAnalyser();
            // we have to connect the MediaElementSource with the analyser
            audioSrc.connect(ctx.destination);
            audioSrc.connect(analyser);
            // we could configure the analyser: e.g. analyser.fftSize (for further infos read the spec)

            // frequencyBinCount tells you how many values you'll receive from the analyser
            frequencyData = new Uint8Array(analyser.frequencyBinCount);


            playTag = document.getElementById("play");

            playTag.onclick = audioToggle;

            playTag.addEventListener("touchend", audioToggle, false);




        }

        function audioToggle(){

            if(audio.paused){
                audio.play();
                playTag.className = "green";
            }else{
                audio.pause();
                playTag.className = "white";
            }
        }

        function update(){
            requestAnimationFrame(update);
            /**
                your code starts
            **/
            analyser.getByteFrequencyData(frequencyData);


            var k;
            for(k = 0; k < 1024; k++){

                cube = cubes[k];
                cube.scale.y =  (frequencyData[k]/1) + 1;
                cube.material.color.setRGB(1, (frequencyData[k]/255), 0);
            }

            /**
                your code ends
            **/
            renderer.render(scene, camera);
        }

        init();
        update();
