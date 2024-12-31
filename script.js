// エンコードとデコードの状態を管理
let isEncoding = true;

// ラジオボタンの選択に応じて処理を切り替える
document.getElementById('encode').addEventListener('change', function () {
    isEncoding = true;
    updateUI();
});

document.getElementById('decode').addEventListener('change', function () {
    isEncoding = false;
    updateUI();
});

// 変換ボタンがクリックされたときの処理
document.querySelector("button").addEventListener("click", function () {
  if (isEncoding) {
      encodeFileToBase64();
  } else {
      decodeBase64ToDownload();
  }
});

// ファイルをBase64にエンコード（画像とSVG対応）
function encodeFileToBase64() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    const textInput = document.getElementById('decodetext').value.trim();

    if (file) {
        const reader = new FileReader();
        reader.onloadend = function () {
            const base64String = reader.result.split(',')[1]; // "data:～base64,"を除去
            document.getElementById('encodetext').value = base64String;
            document.getElementById('fileOutput').innerText = "ファイルがBase64に変換されました。";
        };
        reader.readAsDataURL(file); // ファイルをBase64エンコード
    } else if (textInput) {
        // XML形式（SVG）をBase64に変換
        const base64String = btoa(unescape(encodeURIComponent(textInput)));
        document.getElementById('encodetext').value = base64String;
        document.getElementById('fileOutput').innerText = "テキストがBase64に変換されました。";
    } else {
        alert("ファイルをアップロードするか、エンコードしたいテキストを入力してください。");
    }
}

// Base64をデコードしてダウンロードリンクを生成
function decodeBase64ToDownload() {
    const base64String = document.getElementById('encodetext').value.trim(); // 右側からBase64を取得

    if (base64String) {
        const mimeType = base64String.startsWith('PHN2Zy') ? 'image/svg+xml' : 'image/png'; // SVGか画像を判別
        const fileUrl = `data:${mimeType};base64,${base64String}`;

        // ダウンロードリンクを生成
        const linkElement = document.createElement('a');
        linkElement.href = fileUrl;
        linkElement.download = mimeType === 'image/svg+xml' ? 'decoded_image.svg' : 'decoded_image.png';
        linkElement.textContent = "ここをクリックしてダウンロード";
        linkElement.style.color = "#1a7d7d";
        linkElement.style.textDecoration = "underline";

        // 出力エリアにリンクを表示
        const outputElement = document.getElementById('fileOutput');
        outputElement.innerHTML = ""; // 以前の内容をクリア
        outputElement.appendChild(linkElement);
    } else {
        alert("Base64データを入力してください。");
    }
}

// 初期状態にUIを更新
function updateUI() {
    if (isEncoding) {
        document.getElementById('decodetext').disabled = false; // 左側のテキストエリアを有効
        document.getElementById('fileInput').disabled = false;  // ファイル選択を有効
        document.getElementById('fileOutput').innerText = "";   // 出力エリアをクリア
    } else {
        document.getElementById('decodetext').disabled = true;  // 左側のテキストエリアを無効
        document.getElementById('fileInput').disabled = true;   // ファイル選択を無効
        document.getElementById('fileOutput').innerText = "ここにダウンロードリンクが表示されます。";
    }
}

// ページが読み込まれたときに初期UIを更新
window.onload = updateUI;

// ファイル選択枠をクリックしたら実際のファイル入力を動作させる
document.getElementById("fileInputWrapper").addEventListener("click", function () {
  document.getElementById("fileInput").click();
});
