const Addbtn = document.querySelector(".addbtn");
const Nonce = document.querySelector(".nonce");
const genisis = document.querySelector(".block");
const container = document.querySelector(".container");
const inputs = document.getElementsByTagName("INPUT");
// const sha256 = document.querySelector(".sha256");
// below is and array to store all the blocks generated in transcations
// #################################################################
const block_array = [];
const blocks = [];
const nonce_Array = [];
const object_array = [];
const hash_array = [];
const block_class_array = [];
// for hash ################################################
const hash_checker = function (data, prev, salt = Math.random()) {
  new_obj = {
    data,
    prev,
    salt,
  };
  let hash = sha256(JSON.stringify(new_obj));

  if (hash.substr(0, 3) != "000") {
    let counter = 1;
    while (true) {
      if (hash.substr(0, 3) == "000") {
        // console.log("sha_hash:", hash);
        const salt = new_obj.salt;
        // console.log(hash, salt);
        return { hash, salt };
      } else {
        new_obj.salt = Math.random();
        hash = sha256(JSON.stringify(new_obj));
        counter++;
      }
    }
  } else {
    return { hash, salt };
  }
};
// ######################################################
const nonce_listener = function (arg) {
  // since cloneNode doesnt allow for attaching eventlisteners,i have manually added a function for attaching the listerener
  arg.addEventListener("click", function (e) {
    const blocks_in_dom = document.querySelectorAll(".block");
    const magic_number = e.target.parentElement.children[3].value;
    let [block_data, block_prev, block_hash] =
      blocks[magic_number - 1].children;
    const { hash, salt } = hash_checker(
      block_data.childNodes[3].value,
      block_prev.childNodes[3].value
    );

    block_hash.childNodes[3].value = hash;
    if (object_array.length >= magic_number) {
      let previous_block = blocks[magic_number - 2];
      let block;
      if (!previous_block) {
        previous_block = 0;
        block = 0;
      } else {
        block = new Block(previous_block);
      }
      blocks[magic_number].children[1].childNodes[3].value =
        block_hash.childNodes[3].value;
      // ######################################
      object_array[magic_number - 1].data =
        blocks[magic_number - 1].children[0].childNodes[3].value;
      object_array[magic_number - 1].prev = block;
      object_array[magic_number - 1].hash =
        blocks[magic_number - 1].children[2].childNodes[3].value;
      object_array[magic_number - 1].salt = salt;
      // #######################################################
      hash_array[magic_number] = hash;
      console.log(object_array);
    }
    blocks_in_dom[magic_number - 1].style.backgroundColor =
      "rgba(74, 181, 74, 0.537)";
  });
};

// ##################################
// #################################################################
const block_defaulter = (block, block_in_dom) => {
  const indexofblockinBlocks = blocks.indexOf(block);
  let block_data = block.children[0].childNodes[3].value;
  let block_prev = block.children[1].childNodes[3].value;

  blocks[indexofblockinBlocks].children[2].childNodes[3].value =
    object_array[indexofblockinBlocks].hash;
  let block_hash = block.children[2].childNodes[3].value;
  console.log("block_hash:", block_hash);
  console.log(
    "object thingy:",
    object_array[indexofblockinBlocks].next[1].childNodes[3].value
  );
  if (block_hash == object_array[indexofblockinBlocks].hash) {
    if (
      blocks[indexofblockinBlocks].children[1].childNodes[3].value ==
        "undefined" ||
      blocks[indexofblockinBlocks].children[1].childNodes[3].value == "0"
    ) {
      blocks[indexofblockinBlocks].children[1].childNodes[3].value = "0";
      blocks[indexofblockinBlocks + 1].children[1].childNodes[3].value =
        blocks[indexofblockinBlocks].children[2].childNodes[3].value;
    } else {
      blocks[indexofblockinBlocks].children[1].childNodes[3].value =
        object_array[indexofblockinBlocks].prev.hash;
      blocks[indexofblockinBlocks + 1].children[1].childNodes[3].value =
        blocks[indexofblockinBlocks].children[2].childNodes[3].value;
    }

    block_in_dom.style.backgroundColor = "rgba(74, 181, 74, 0.537)";
  }
};

const block_changer = (block, block_in_dom) => {
  block_in_dom.style.backgroundColor = "rgba(221, 63, 63, 0.7)";
  const indexofblockinBlocks = blocks.indexOf(block);
  const block_data = block.children[0].childNodes[3].value;
  const block_prev = block.children[1].childNodes[3].value;
  const hash = sha256(String(Math.random()));
  blocks[indexofblockinBlocks].children[2].childNodes[3].value = hash;
  blocks[indexofblockinBlocks + 1].children[1].childNodes[3].value = hash;
  // console.log(block_data, block_prev, block_hash);
};
// #################################################################
const input_listener = function (arg) {
  arg.addEventListener("input", function (e) {
    const magic_number = e.target.parentElement.parentElement.children[3].value;
    if (object_array.length < magic_number) {
      let block = blocks[magic_number - 1];
      let block_data = block.children[0].childNodes[3].value;
      let block_prev = block.children[1].childNodes[3].value;
      let block_salt;
      const { hash, salt } = hash_checker(block_data, block_prev, block_salt);
      block.children[0].childNodes[3].value = e.target.value;
      block.children[2].childNodes[3].value = hash;
    } else {
      let block = blocks[magic_number - 1];
      let block_hash = hash_array[magic_number];
      let block_data = e.target.value;
      let block_prev = object_array[magic_number - 1].prev.hash;
      if (!block_prev) {
        block_prev = 0;
      }
      const block_salt = object_array[magic_number - 1].salt;
      let { hash, salt } = hash_checker(block_data, block_prev, block_salt);
      // console.log("hasharray:", hash_array);
      // console.log("block_hash:", block_hash);
      // console.log("hash:", hash);
      // console.log("hash array:", hash_array);
      // console.log("block_hash:", block_hash);
      // console.log("hash:", hash);
      // console.log("objectarray:", object_array[magic_number - 1]);
      if (
        magic_number == 1 &&
        e.target.value == object_array[magic_number - 1].data
      ) {
        hash = block_hash;
        // object_array[magic_number - 1].hash = hash;
      }
      // ###########################
      if (block_hash == hash) {
        const blocks_in_dom = document.querySelectorAll(".block");
        for (let i = magic_number; i < blocks.length; i++) {
          block_defaulter(blocks[i - 1], blocks_in_dom[i - 1]);
        }
        // ############################################### leave
        console.log("success they are equal");
        // ################################################
      } else {
        const blocks_in_dom = document.querySelectorAll(".block");
        for (let i = magic_number; i < blocks.length; i++) {
          block_changer(blocks[i - 1], blocks_in_dom[i - 1]);
          // genisis.style.backgroundColor = "yellow";
        }
      }
    }
  });
};
class Block {
  constructor(block) {
    this.data = block.children[0].childNodes[3].value;
    this.prev = block.children[1].childNodes[3].value;
    this.hash = block.children[2].childNodes[3].value;
    this.block = block;
  }
}
// #################################################################
blocks.push(genisis);
blocks[0].style.backgroundColor = "#82a6cb";
hash_array.push(genisis.children[2].childNodes[3].value);
// #################################################################

AddClone = function () {
  let block = blocks[blocks.length - 1];
  block.style.backgroundColor = "rgba(74, 181, 74, 0.537)";
  block_array.push(block);
  [block_data, block_prev, block_next] = block.children;
  const block_hash = block_next.childNodes[3].value;
  var clone = block.cloneNode(true);
  clone.style.backgroundColor = "#82a6cb";
  [clone_data, clone_prev, clone_hash, counter, noncebutton, addbutton] =
    clone.children;
  const { hash, salt } = hash_checker(
    block_data.childNodes[3].value,
    block_prev.childNodes[3].value
  );
  const _block = new Block(block);
  block_class_array.push(_block);
  hash_array.push(hash);
  clone_data.childNodes[3].value = "";
  clone_prev.childNodes[3].value = block_hash;
  clone_hash.childNodes[3].value = hash;
  new_obj = {
    data: block_data.childNodes[3].value,
    prev:
      block_class_array.length == 1
        ? 0
        : block_class_array[block_class_array.length - 2],
    hash: block_next.childNodes[3].value,
    salt,
    next: clone.children,
  };
  object_array.push(new_obj);
  counter.value = counter.value * 1 + 1;
  addbutton.remove();
  clone.append(Addbtn);
  nonce_listener(clone.children[4]);
  blocks.push(clone);
  container.append(clone);
  input_listener(clone_data.children[1]);
  console.log(object_array);
};
// listener attachments#####################################..$$$$$$$$$$$$$$$$$$$$$$$$$
Addbtn.addEventListener("click", AddClone);
nonce_listener(Nonce);
for (element of inputs) {
  input_listener(element);
}
