<template>
  <div class="hello">
    <button id="upImg"></button>
    <img id="imgs" :src="img" alt="">
  </div>
</template>

<script>
import plupload from "plupload"
import util from './../../static/utils'
import $ from 'jquery'
export default {
  name: 'HelloWorld',
  data () {
    return {
      img: require('C:/Users/Administrator/Desktop/timg.jpg'),
      imagePreviewUrl: '',
      // 图片上传配置-------上线之前需要修改
      aliossHost: 'https://img.meinianuniversity.com',
      serverHost: 'https://lms.meinianuniversity.com/AliyunOSS/GetOssSignature',
      aliossBucketFloder: 'AppUpLoad',
      // 图片file对象
      isImgFile: '',
      // 图片上传实例对象
      uploader: ''
    }
  },
  mounted () {
    let _this = this
    this.initialUploader()
    // this.upload() 
    
    util.convertImgToBase64(this.img, function (base64Img) {
      // alert(base64Img)
      _this.uploader.addFile(base64Img)
      // _this.uploader.start()
      // this.isImgFile = base64Img
      _this.isImgFile = util.dataURLtoFile(base64Img, 'img')
      console.log(_this.isImgFile)
      let type = _this.isImgFile.type.split('/')[1]
      // var Num = files[0].name.split(".");
      // var type = Num[Num.length-1];
      _this.imageUrl = _this.jsonDateFormat() + "/" + Date.parse(new Date()) + Math.floor(Math.random() * 100000) + "." + type;
      _this.set_upload_param(_this.uploader, 1)
      // _this.uploader.start()
    })
    // this.set_upload_param(this.uploader, this.isImgFile)
    // this.imgBase64(this.img)
    // this.set_upload_param(this.uploader)
    // this.uploader.trigger('FilesAdded'), (val) => {
    //   console.log(val)
    //   this.set_upload_param(this.uploader)
    //   this.uploader.start()
    // }
  },
  methods: {
    initialUploader () {
      var vm = this;
      vm.uploader = new plupload.Uploader({
        browse_button: 'upImg',
        url: vm.aliossHost,
        multi_selection: true, // single file
        filters: {
          mime_types:vm.mime_types,
          max_file_size: "100mb",
          prevent_duplicates: false //不允许选取重复文件
        },
        resize:{
          width: vm.width,
          height:vm.height,
          crop: true,
          quality: 150,
          preserve_headers: true
        },
        init: {
          FilesAdded: function(up, files) {
            console.log(files)
            if (up.files.length > 1) {
              up.removeFile(up.files[0]);
            }
            vm.fileName = files[0].name;
            var Num = files[0].name.split(".");
            var type = Num[Num.length-1];
            vm.imageUrl = vm.jsonDateFormat() + "/" + Date.parse(new Date()) + Math.floor(Math.random() * 100000) + "." + type;
            vm.set_upload_param(up);
            vm.$emit('FilesAdded',true)
          },
          FileUploaded: function(up, file, info) {
            alert(1)
            let index;
            if (info.status == 200) {
              // 全路径
              vm.imagePreviewUrl = vm.aliossHost + '/' + vm.aliossBucketFloder +'/' + vm.imageUrl; //上传成功后更新地址
              // 不带域名的地址
              vm.imageUrl = '/' + vm.aliossBucketFloder +'/' + vm.imageUrl
              // 输出给父组件
              vm.$emit('FileImgPath', vm.imageUrl, vm.imagePreviewUrl)
            } else {
              vm.$emit('FileUpError');
            }
          }
        }
      });
      vm.uploader.init();
    },
    set_upload_param(up,index) {
      var new_multipart_params;
      var vm = this;
      $.ajax({
        type: "get", 
        url: vm.serverHost,
        data:{dir:vm.aliossBucketFloder},
        async:false,
        success:function(res){
          if(res.Code==200){
            vm.index = index;
            var rdata = res.Data;
            new_multipart_params = {
              'key' : vm.aliossBucketFloder + "/" + vm.imageUrl,
              'policy' : rdata.policy,
              'OSSAccessKeyId' : rdata.accessid,
              'success_action_status' : "200",
              'signature' : rdata.signature
            };
            up.setOption({
              'url': rdata.host,
              'multipart_params': new_multipart_params
            });
            console.log(vm.uploader)
            // vm.uploader.addFile(vm.isImgFile, 'isImg')
            up.start();
            console.log(new_multipart_params)
            var data = new FormData()
            let from = {
              name: 'img.png',
              key: new_multipart_params.key,
              policy:new_multipart_params.policy,
              OSSAccessKeyId:new_multipart_params.OSSAccessKeyId,
              success_action_status: new_multipart_params.success_action_status,
              signature: new_multipart_params.signature,
              file: vm.isImgFile
            }
            data.append('name', 'img.pne')
            data.append('key', new_multipart_params.key)
            data.append('policy', new_multipart_params.policy)
            data.append('OSSAccessKeyId', new_multipart_params.OSSAccessKeyId)
            data.append('success_action_status', new_multipart_params.success_action_status)
            data.append('signature', new_multipart_params.signature)
            data.append('file', vm.isImgFile)
            // data.name = 'img.name'
            // data.key = new_multipart_params.key
            // data.policy = new_multipart_params.policy
            // data.OSSAccessKeyId = new_multipart_params.OSSAccessKeyId
            // data.success_action_status = new_multipart_params.success_action_status
            // data.signature = new_multipart_params.signature
            // data.file = vm.isImgFile
            // data.append(new_multipart_params)
            console.log(data)
             $.ajax({
               type: "post",
               url: 'https://img.meinianuniversity.com/',
              //  contentType:false,
              //  data:{
              //    name: 'img.png',
              //    key: new_multipart_params.key,
              //    policy:new_multipart_params.policy,
              //    OSSAccessKeyId:new_multipart_params.OSSAccessKeyId,
              //    success_action_status: new_multipart_params.success_action_status,
              //    signature: new_multipart_params.signature,
              //    file: vm.isImgFile
              //  },
              data: '',
               success:function () {

               }
             })
          }
        }
      });
      console.log(vm.aliossHost + '/' + vm.aliossBucketFloder +'/' + vm.imageUrl)
    },
    jsonDateFormat() {
      var date = new Date();
      var yyyy = date.getFullYear().toString();
      var mm = (date.getMonth() + 1).toString(); // getMonth() is zero-based
      var dd = date.getDate().toString();
      return yyyy + "/" + (mm[1] ? mm : "0" + mm[0]) + "/" + (dd[1] ? dd : "0" + dd[0]);
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
