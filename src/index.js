const Addbtn = document.querySelector('.addbtn');
const Nonce = document.querySelector('.nonce');
const genisis = document.querySelector('.block');
const container = document.querySelector('.container');
const inputs = document.getElementsByTagName('INPUT');
// holds blocks
const block_array = [];
// holds block objects
const blocks = [];
// holds nonce data
const nonce_Array = [];
// holds blocks
const object_array = [];
// holds transaction data
const hash_array = [];
// holds hashes ib block
const block_class_array = [];
const hash_checker = function (data, prev, salt = Math.random()) {
  new_obj = {
    data,
    prev,
    salt,
  };
  let hash = sha256(JSON.stringify(new_obj));

  if (hash.substr(0, 3) != '000') {
    let counter = 1;
    while (true) {
      if (hash.substr(0, 3) == '000') {
        console.log('Nonce:', counter);
        const salt = new_obj.salt;
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
const nonce_listener = function (arg) {
  arg.addEventListener('click', function (e) {
    const blocks_in_dom = document.querySelectorAll('.block');
    const magic_number = e.target.parentElement.children[3].value;
    let [block_data, block_prev, block_hash] =
      blocks[magic_number - 1].children;
    const { hash, salt } = hash_checker(
      block_data.childNodes[3].value,
      block_prev.childNodes[3].value
    );

    if (object_array.length >= magic_number) {
      if (
        block_data.childNodes[3].value == object_array[magic_number - 1].data &&
        block_hash.childNodes[3].value == object_array[magic_number - 1].hash
      ) {
      } else {
        block_hash.childNodes[3].value = hash;
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
        hash_array[magic_number - 1] = hash;
        blocks_in_dom[magic_number - 1].style.backgroundColor =
          'rgba(74, 181, 74, 0.537)';
      }
    }
  });
};

const block_defaulter = (block, block_in_dom) => {
  const indexofblockinBlocks = blocks.indexOf(block);
  let block_data = block.children[0].childNodes[3].value;
  let block_prev = block.children[1].childNodes[3].value;
  let block_hash = block.children[2].childNodes[3].value;
  if (block_data == object_array[indexofblockinBlocks].data) {
    if (
      blocks[indexofblockinBlocks].children[1].childNodes[3].value ==
        'undefined' ||
      blocks[indexofblockinBlocks].children[1].childNodes[3].value == '0'
    ) {
      blocks[indexofblockinBlocks].children[1].childNodes[3].value = '0';
      const block_data =
        blocks[indexofblockinBlocks].children[0].childNodes[3].value;
      const block_prev =
        blocks[indexofblockinBlocks].children[1].childNodes[3].value;
      const block_salt = object_array[indexofblockinBlocks].salt;
      const { hash, salt } = hash_checker(block_data, block_prev, block_salt);

      if (hash == object_array[indexofblockinBlocks].hash) {
        block.children[2].childNodes[3].value = hash;
        blocks[indexofblockinBlocks + 1].children[1].childNodes[3].value = hash;
        block_in_dom.style.backgroundColor = 'rgba(74, 181, 74, 0.537)';
      }
      if (
        blocks[indexofblockinBlocks + 1].children[2].childNodes[3].value !=
        object_array[indexofblockinBlocks + 1].hash
      ) {
      } else {
        blocks[indexofblockinBlocks + 1].children[1].childNodes[3].value =
          block.children[2].childNodes[3].value;
      }
    } else {
      const block_data =
        blocks[indexofblockinBlocks].children[0].childNodes[3].value;
      const block_prev =
        blocks[indexofblockinBlocks].children[1].childNodes[3].value;
      const block_salt = object_array[indexofblockinBlocks].salt;
      const { hash, salt } = hash_checker(block_data, block_prev, block_salt);

      if (hash == object_array[indexofblockinBlocks].hash) {
        block.children[2].childNodes[3].value = hash;
        blocks[indexofblockinBlocks + 1].children[1].childNodes[3].value = hash;
        block_in_dom.style.backgroundColor = 'rgba(74, 181, 74, 0.537)';
      }
      if (
        blocks[indexofblockinBlocks + 1].children[2].childNodes[3].value !=
        object_array[indexofblockinBlocks + 1]?.hash
      ) {
      } else {
        blocks[indexofblockinBlocks + 1].children[1].childNodes[3].value =
          block.children[2].childNodes[3].value;
      }
    }
  }
};

const block_changer = (block, block_in_dom) => {
  block_in_dom.style.backgroundColor = 'rgba(221, 63, 63, 0.7)';

  const indexofblockinBlocks = blocks.indexOf(block);
  const block_data = block.children[0].childNodes[3].value;
  const block_prev = block.children[1].childNodes[3].value;
  const hash = sha256(String(Math.random()));
  blocks[indexofblockinBlocks].children[2].childNodes[3].value = hash;
  blocks[indexofblockinBlocks + 1].children[1].childNodes[3].value = hash;
};
const input_listener = function (arg) {
  arg.addEventListener('input', function (e) {
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
      let block_hash = hash_array[magic_number - 1];
      let block_data = e.target.value;
      let block_prev = object_array[magic_number - 1].prev.hash;
      if (!block_prev) {
        block_prev = 0;
      }
      const block_salt = object_array[magic_number - 1].salt;
      let { hash, salt } = hash_checker(block_data, block_prev, block_salt);

      if (
        magic_number == 1 &&
        e.target.value == object_array[magic_number - 1].data
      ) {
        hash = block_hash;
      }

      if (hash_array[magic_number - 1] == hash) {
        const blocks_in_dom = document.querySelectorAll('.block');
        for (let i = magic_number; i < blocks.length; i++) {
          block_defaulter(blocks[i - 1], blocks_in_dom[i - 1]);
        }
      } else {
        const blocks_in_dom = document.querySelectorAll('.block');
        for (let i = magic_number; i < blocks.length; i++) {
          block_changer(blocks[i - 1], blocks_in_dom[i - 1]);
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
blocks.push(genisis);
blocks[0].style.backgroundColor = '#82a6cb';

AddClone = function () {
  let block = blocks[blocks.length - 1];
  block.style.backgroundColor = 'rgba(74, 181, 74, 0.537)';
  block_array.push(block);
  [block_data, block_prev, block_next] = block.children;
  var clone = block.cloneNode(true);
  clone.style.backgroundColor = '#82a6cb';
  [clone_data, clone_prev, clone_hash, counter, noncebutton, addbutton] =
    clone.children;
  const { hash, salt } = hash_checker(
    block_data.childNodes[3].value,
    block_prev.childNodes[3].value
  );
  block_next.childNodes[3].value = hash;
  const block_hash = block_next.childNodes[3].value;
  const _block = new Block(block);
  block_class_array.push(_block);
  hash_array.push(hash);
  clone_data.childNodes[3].value = '';
  clone_prev.childNodes[3].value = block_hash;
  clone_hash.childNodes[3].value = '';
  new_obj = {
    data: block_data.childNodes[3].value,
    prev:
      block_class_array.length == 1
        ? 0
        : block_class_array[block_class_array.length - 2],
    hash: hash,
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
  // console.log(object_array);
};
Addbtn.addEventListener('click', AddClone);
nonce_listener(Nonce);
for (element of inputs) {
  input_listener(element);
}
