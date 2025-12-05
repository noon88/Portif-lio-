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

// ===== CAMINHO BASE DO GITHUB PARA MTL E TEXTURAS =====
// coloque AQUI a pasta "modelos" do GitHub
const baseGitHub = "https://raw.githubusercontent.com/noon88/Portif-lio-/main/";

// ===== MODELOS =====
const modelos = [
  {
    nome: "Headphones",
    mtlURL: baseGitHub + "modelos/modelo1/headphones.mtl",
    objURL: "https://drive.google.com/uc?export=download&id=1Co5lRCU3cmCOPcGOXFSmu3tDpu_99OSK"
  },
  {
    nome: "Doctor",
    mtlURL: baseGitHub + "modelos/modelo2/doctor.mtl",
    objURL: "https://drive.google.com/uc?export=download&id=1A4F1eORiLfmiAKHN1VpcH96FI-56iQNJ"
  },
  {
    nome: "Energy",
    mtlURL: baseGitHub + "modelos/modelo3/energy.mtl",
    objURL: "https://drive.google.com/uc?export=download&id=18EkqdMKzAVDAYTr63yOHU0uf76uHHNAa"
  },
];

// ===== FUNÇÃO PARA CARREGAR MODELO =====
function carregarModeloDeURL(model) {
  // Remove o objeto anterior
  scene.traverse(child => {
    if (child.isMesh) scene.remove(child);
  });

  const mtlLoader = new THREE.MTLLoader();
  mtlLoader.setResourcePath(baseGitHub); // garante texturas dentro da pasta
  mtlLoader.load(model.mtlURL, function(materials) {
    materials.preload();

    const objLoader = new THREE.OBJLoader();
    objLoader.setMaterials(materials);

    // ===== OBJ vindo do GOOGLE DRIVE =====
    objLoader.load(
      model.objURL,
      function(object) {
        scene.add(object);
        object.position.set(0, 0, 0);
      },
      undefined,
      function(error) {
        console.error("Erro ao carregar OBJ:", error);
      }
    );
  });
}

// ===== BOTÕES =====
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

// ===== LOOP =====
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