// ===== SCENE, CAMERA, RENDERER =====
const container = document.getElementById("viewer3d");
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111);

const camera = new THREE.PerspectiveCamera(
  60,
  container.clientWidth / container.clientHeight,
  0.1,
  1000
);
camera.position.set(2, 2, 3);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

const light = new THREE.HemisphereLight(0xffffff, 0x000000, 1.5);
scene.add(light);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// ===== MODELOS COM SUAS URLs =====
const modelos = [
  {
    nome: "Headphones",
    mtlURL: "https://seusite.com/path/modelos/modelo1/headphones.mtl",
    objURL: "https://seusite.com/path/modelos/modelo1/headphones.obj"
  },
  {
    nome: "Doctor",
    mtlURL: "https://seusite.com/path/modelos/modelo2/doctor.mtl",
    objURL: "https://seusite.com/path/modelos/modelo2/doctor.obj"
  },
    {
    nome: "Energy",
    mtlURL: "https://seusite.com/path/modelos/modelo1/energy.mtl",
    objURL: "https://seusite.com/path/modelos/modelo1/energy.obj"
  },
];

// ===== FUNÇÃO PARA CARREGAR UM MODELO A PARTIR DA URL =====
function carregarModeloDeURL(model) {
  // Limpa modelo anterior da cena
  scene.traverse(child => {
    if (child.isMesh) scene.remove(child);
  });

  const mtlLoader = new THREE.MTLLoader();
  mtlLoader.load(model.mtlURL, function(materials) {
    materials.preload();

    const objLoader = new THREE.OBJLoader();
    objLoader.setMaterials(materials);
    objLoader.load(model.objURL, function(object) {
      scene.add(object);
      object.position.set(0, 0, 0);
    }, undefined, function(error) {
      console.error("Erro ao carregar OBJ:", error);
    });
  }, undefined, function(error) {
    console.error("Erro ao carregar MTL:", error);
  });
}

// ===== CRIA BOTÕES DINÂMICOS PARA CADA MODELO =====
const btnContainer = document.createElement("div");
btnContainer.style.margin = "20px 0";
btnContainer.style.display = "flex";
btnContainer.style.gap = "10px";

modelos.forEach(modelo => {
  const btn = document.createElement("button");
  btn.innerText = modelo.nome;
  btn.style.padding = "10px 20px";
  btn.style.border = "2px solid #3498db";
  btn.style.background = "transparent";
  btn.style.color = "#3498db";
  btn.style.cursor = "pointer";
  btn.style.borderRadius = "5px";
  btn.addEventListener("click", () => carregarModeloDeURL(modelo));
  btnContainer.appendChild(btn);
});

container.parentElement.insertBefore(btnContainer, container);

// ===== LOOP DE ANIMAÇÃO =====
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

// ===== RESPONSIVO =====
window.addEventListener("resize", () => {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
});