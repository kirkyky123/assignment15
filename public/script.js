let selectedCraft = null;

const showCrafts = async () => {
  const craftsJSON = await getJSON();

  if (craftsJSON == "") return;

  let craftsDiv = document.getElementById("crafts-container");

  craftsJSON.forEach((craft) => {
    let column = document.createElement("div");
    column.classList.add("column");
    craftsDiv.append(column);

    let img = document.createElement("img");
    column.append(img);
    img.src = `/images/${craft.image}`;
    img.alt = craft.name;
    img.onclick = () => showModal(craft);
  });
};

const showModal = (craft) => {
  selectedCraft = craft;
  const modal = document.getElementById("modal");
  modal.style.display = "block";
  const modalContent = document.getElementById("modal-content");
  modalContent.innerHTML = `
    <div class="modal-left">
      <img src="/images/${craft.image}" alt="${craft.name}">
    </div>
    <div class="modal-right">
      <span class="close">&times;</span>
      <h2>${craft.name}</h2>
      <p>${craft.description}</p>
      <h3>Supplies:</h3>
      <ul>
        ${craft.supplies.map((supply) => `<li>${supply}</li>`).join("")}
      </ul>
    </div>
  `;
  const closeModal = () => {
    modal.style.display = "none";
  };
  const closeBtn = modalContent.querySelector(".close");
  closeBtn.onclick = closeModal;
  window.onclick = (event) => {
    if (event.target == modal) {
      closeModal();
    }
  };
};

const getJSON = async () => {
  try {
    let response = await fetch("/api/crafts");
    let craftsJSON = await response.json();
    return craftsJSON;
  } catch (error) {
    console.log(error);
    return "";
  }
};

window.onload = () => {
  showCrafts();

  // Open craft dialog when '+' link is clicked
  document.getElementById("add-craft-link").onclick = () => openCraftDialog();

  // Form submission event listener
  document.getElementById("add-craft-form").onsubmit = async (e) => {
    e.preventDefault();
    await addCraft();
  };

  // Add supply event listener
  document.getElementById("add-supply").onclick = (e) => {
    e.preventDefault();
    addSupplyInput();
  };

  // Cancel button event listener
  document.getElementById("cancel-btn").onclick = (e) => {
    e.preventDefault();
    closeCraftDialog();
  };

  // Reset form and close dialog when the dialog is closed
  document.getElementById("craft-dialog").addEventListener('click', (e) => {
    if (e.target === document.getElementById("craft-dialog")) {
      resetCraftForm();
      closeCraftDialog();
    }
  });
};

const openCraftDialog = () => {
  document.getElementById("craft-dialog").style.display = "block";
};

const closeCraftDialog = () => {
  document.getElementById("craft-dialog").style.display = "none";
};

const resetCraftForm = () => {
  document.getElementById("add-craft-form").reset();
  document.getElementById("supplies-container").innerHTML = '';
};

const addSupplyInput = () => {
  const suppliesContainer = document.getElementById("supplies-container");
  const input = document.createElement("input");
  input.type = "text";
  input.name = "supplies";
  input.required = true;
  suppliesContainer.appendChild(input);
  suppliesContainer.appendChild(document.createElement("br"));
};

const addCraft = async () => {
  const form = document.getElementById("add-craft-form");
  const formData = new FormData(form);
  const response = await fetch("/api/addCraft", {
    method: "POST",
    body: formData,
  });
  if (response.ok) {
    const newCraft = await response.json();
    resetCraftForm();
    closeCraftDialog();
    // Refresh crafts after adding a new one
    showCrafts();
  } else {
    console.error("Failed to add craft");
  }
};
