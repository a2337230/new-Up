export default {
  convertImgToBase64: function (url, callback, outputFormat){
    var canvas = document.createElement('CANVAS'),
    　　ctx = canvas.getContext('2d'),
    　　img = new Image;
    　　img.crossOrigin = 'Anonymous';
    　　img.onload = function(){
    　　canvas.height = img.height;
    　　canvas.width = img.width;
    　　ctx.drawImage(img,0,0);
    　　var dataURL = canvas.toDataURL(outputFormat || 'image/png');
    　　callback.call(this, dataURL);
    　　canvas = null; 
      }
    　　img.src = url;
    },
    dataURLtoFile: function(dataurl, filename) {
      var arr = dataurl.split(',');
      var mime = arr[0].match(/:(.*?);/)[1];
      var bstr = atob(arr[1]);
      var n = bstr.length; 
      var u8arr = new Uint8Array(n);
      while(n--){
          u8arr[n] = bstr.charCodeAt(n);
      }
      //转换成file对象
      return new File([u8arr], filename, {type:mime});
      //转换成成blob对象
      //return new Blob([u8arr],{type:mime});
    }
}