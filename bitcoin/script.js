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
const nonce_listener = function (arg) {
  // since cloneNode doesnt allow for attaching eventlisteners,i have manually added a function for attaching the listerener
  arg.addEventListener("click", function () {
    // create a new hash that is valid
  });
};

// for hash ################################################
const hash_checker = function (data, prev, salt = Math.random()) {
  new_obj = {
    data,
    prev,
    salt,
  };
  let hash = sha256(JSON.stringify(new_obj));
  // console.log(hash);
  if (hash.substr(0, 3) != "000") {
    let counter = 1;
    while (true) {
      if (hash.substr(0, 3) == "000") {
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
      object_array[magic_number - 1].data = e.target.value;
      const block_hash = hash_array[magic_number];
      const block_data = object_array[magic_number - 1].data;
      let block_prev = object_array[magic_number - 1].prev.hash;

      if (!block_prev) {
        block_prev = "0";
      }
      const block_salt = object_array[magic_number - 1].salt;
      const { hash, salt } = hash_checker(block_data, block_prev, block_salt);
      console.log("hash from function:", hash);
      // ###########################
      // ###########################
      // ###########################
      // ###########################
      // ###########################
      // ###########################
      if (block_hash === hash) {
        blocks[magic_number - 1].children[2].childNodes[3].value =
          hash_array[magic_number - 1];
      } else {
        let block = blocks[magic_number - 1];
        let block_data = block.children[0].childNodes[3].value;
        let block_prev = block.children[1].childNodes[3].value;
        let block_salt;
        const { hash, salt } = hash_checker(block_data, block_prev, block_salt);
        block.children[2].childNodes[3].value = hash;
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

blocks.push(genisis);
hash_array.push(genisis.children[2].childNodes[3].value);
// #################################################################
// #################################################################
AddClone = function () {
  let block = blocks[blocks.length - 1];
  block_array.push(block);
  [block_data, block_prev, block_next] = block.children;
  const block_hash = block_next.childNodes[3].value;
  var clone = block.cloneNode(true);
  [clone_data, clone_prev, clone_hash, counter, noncebutton, addbutton] =
    clone.children;

  const { hash, salt } = hash_checker(
    block_data.childNodes[3].value,
    block_prev.childNodes[3].value,
    Math.random()
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
  };
  object_array.push(new_obj);
  counter.value = counter.value * 1 + 1;
  addbutton.remove();
  clone.append(Addbtn);
  nonce_listener(clone.children[3]);
  blocks.push(clone);
  container.append(clone);
  input_listener(clone_data.children[1]);
};

// listener attachments#####################################..$$$$$$$$$$$$$$$$$$$$$$$$$
Addbtn.addEventListener("click", AddClone);
nonce_listener(Nonce);
for (element of inputs) {
  input_listener(element);
}
