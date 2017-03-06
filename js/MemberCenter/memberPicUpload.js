
accessid = '';
accesskey = '';
host = '';
policyBase64 = '';
signature = '';
callbackbody = '';
filename = '';
key = '';
expire = 0;
g_object_name = '';
g_object_name_type = '';
now = timestamp = Date.parse(new Date()) / 1000; 
type=0;
id=0;
function send_request(obj,entId)
{
    var xmlhttp = null;
    if (window.XMLHttpRequest)
    {
        xmlhttp=new XMLHttpRequest();
    }
    else if (window.ActiveXObject)
    {
        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
  
    if (xmlhttp!=null)
    {
        serverUrl = 'http://192.168.21.165:8080/testUpload?type='+obj+'&id='+entId;
        xmlhttp.open( "GET", serverUrl, false );
        xmlhttp.send( null );
        return xmlhttp.responseText;
    }
    else
    {
        alert("Your browser does not support XMLHTTP.");
    }
};

function check_object_radio() {
	g_object_name_type = 'random_name';

}

function get_signature(obj,entId)
{
    //可以判断当前expire是否超过了当前时间,如果超过了当前时间,就重新取一下.3s 做为缓冲
    now = timestamp = Date.parse(new Date()) / 1000; 
    if (expire < now + 3)
    {
        body = send_request(obj,entId);
        var obj = eval ("(" + body + ")");
        host = obj['host'];
        policyBase64 = obj['policy'];
        accessid = obj['accessid'];
        signature = obj['signature'];
        expire = parseInt(obj['expire']);
        callbackbody = obj['callback'] ;
        key = obj['dir'];
        return true;
    }
    return false;
};

function random_string(len) {
len = len || 32;
var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';   
var maxPos = chars.length;
var pwd = '';
for (i = 0; i < len; i++) {
pwd += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
}

function get_suffix(filename) {
    pos = filename.lastIndexOf('.');
    suffix = '';
    if (pos != -1) {
        suffix = filename.substring(pos);
    }
    return suffix;
}

function calculate_object_name(filename)
{
    if (g_object_name_type == 'local_name')
    {
        g_object_name += "${filename}";
    }
    else if (g_object_name_type == 'random_name')
    {
        suffix = get_suffix(filename);
        g_object_name = key + random_string(5) + suffix;
    }
    return '';
}

function get_uploaded_object_name(filename)
{
    if (g_object_name_type == 'local_name')
    {
        tmp_name = g_object_name;
        tmp_name = tmp_name.replace("${filename}", filename);
        return tmp_name;
    }
    else if(g_object_name_type == 'random_name')
    {
        return g_object_name;
    }
}

function set_upload_param(up, filename, ret,obj,entId)
{
	type=obj;
	id=entId;
	if (ret == false)
    {
        ret = get_signature(obj,entId);
    }
    g_object_name = key;
    if (filename != '') {
        suffix = get_suffix(filename);
        calculate_object_name(filename);
    }
    new_multipart_params = {
        'key' : g_object_name,
        'policy': policyBase64,
        'OSSAccessKeyId': accessid, 
        'success_action_status' : '200', //让服务端返回200,不然，默认会返回204
        'callback' : callbackbody,
        'signature': signature
    };

    up.setOption({
        'url': host,
        'multipart_params': new_multipart_params
    });
    up.start();
}

plupload.addFileFilter('width_div_height', function(maxRes, file, cb) {
	  var self = this, img = new o.Image();
	  function finalize(result) {
	    // cleanup
	    img.destroy();
	    img = null;
	    // if rule has been violated in one way or another, trigger an error
	    if (!result) {
	      self.trigger('Error', {
	        code : -1987,
	        message : "图片比例错误!",
	        file : file
	      });
	       
	    }
	    cb(result);
	  }
	 
	  img.onload = function() {
	    // check if resolution cap is not exceeded
	    finalize(img.width / img.height == maxRes);
	  };
	 
	  img.onerror = function() {
	    finalize(false);
	  };
	 
	  img.load(file.getSource());
	});
//创建实例的构造方法
var uploader1 = new plupload.Uploader({
	//上传插件初始化选用哪种优先级顺序，如果第一个初始化失败就走第二个
	runtimes : 'html5,flash,silverlight,html4',
	//触发浏览文件按钮标签的唯一id
	browse_button : 'selectfiles', 
	//多选对话框
	multi_selection: false,
	//展示上传文件列表的容器
	container: document.getElementById('container'),
	//flash文件地址
	flash_swf_url : '/asset/lib/plupload-2.1.2/js/Moxie.swf',
	//silverlight文件地址
	silverlight_xap_url : '/asset/lib/plupload-2.1.2/js/Moxie.xap',
	//上传服务器地址
    url : 'http://oss.aliyuncs.com',
    //选择文件扩展名的过滤器，每个过滤规则只有title和ext两项[{title:}]
    filters: filters1,
    //初始化plupload实例，添加监听对象
	init: {
		//init执行完之后要执行的事件触发
		PostInit: function() {
		},
		//用户选择文件时触发
		FilesAdded: function(up, files) {
			plupload.each(files, function(file) {
				document.getElementById('ossfile1').innerHTML += '<div style="display:none;"  id="' + file.id + '"><b1></b1>'
				+'<div class="progress"><div class="progress-bar" style="width: 0%"></div></div>'
				+'</div>';
			});
			document.getElementById('postfiles1').click(); 		
		},
		//文件上传完之前触发的事件
		BeforeUpload: function(up, file) {
            check_object_radio();
            file_name = file.name;
            //console.log(file.name);     
      
			var fileSize=file.size/1024;
            set_upload_param(up, file.name, true,type,id);
           
        },
        //文件正在被上传中触发
		UploadProgress: function(up, file) {
//			var d = document.getElementById(file.id);
//			d.getElementsByTagName('b1')[0].innerHTML = '<span>' + file.percent + "%</span>";
//            var prog = d.getElementsByTagName('div')[0];
//			var progBar = prog.getElementsByTagName('div')[0];
//			progBar.style.width= 2*file.percent+'px';
//			progBar.setAttribute('aria-valuenow', file.percent);
		},
		//文件上传成功时触发
		FileUploaded: function(up, file, info) {
            if (info.status == 200)
            {	
            	uploaded_file_url = oss_url+'/' + get_uploaded_object_name(file.name);
            	document.getElementById("commentFileUrl").value = uploaded_file_url;
            	//document.getElementById("aaaa").setAttribute("src",uploaded_file_url);
                document.getElementById('callback').click(); 
            }
            else
            {
                document.getElementById(file.id).getElementsByTagName('b1')[0].innerHTML = info.response;
            } 
		},
		
		Error: function(up, err) {
            if (err.code == -600) {
            	var filters = up.getOption("filters");
            	alert("上传图片大于"+filters.max_file_size+"");
            	//parent.document.getElementById("productMsg").innerHTML = "上传视频大于30M！";
            	//parent.jquery("#myModal").modal('show');
            }
            else if (err.code == -601) {
            	var filters = up.getOption("filters");
            	var mime_types =  filters.mime_types;
            	var extensions = mime_types[0].extensions;
            	alert("图片格式不正确,请上传"+extensions+"格式的图片");
            	//parent.document.getElementById("productMsg").innerHTML = "视频格式不正确，请上传mp4、avi、rmvb、wmv、3gp、amv、dmv、rm格式的视频";
            	//parent.jquery("#myModal").modal('show');
            }
            else if (err.code == -602) {
            	//arent.document.getElementById("productMsg").innerHTML = "该视频已经上传过了！";
            	//parent.jquery("#myModal").modal('show');
            }
            else if(err.code == -1987){
            	alert("四季田景图片宽必须为高的二倍");
            }
            else 
            {
            	alert(err.response);
            	//parent.document.getElementById("productMsg").innerHTML = "\nError xml:" + err.response;
            	//parent.jquery("#myModal").modal('show');
            }
		}
	}
});

uploader1.init();

//创建实例的构造方法
var uploader2 = new plupload.Uploader({
	//上传插件初始化选用哪种优先级顺序，如果第一个初始化失败就走第二个
	runtimes : 'html5,flash,silverlight,html4',
	//触发浏览文件按钮标签的唯一id
	browse_button : 'selectSharefiles', 
	//多选对话框
	multi_selection: false,
	//展示上传文件列表的容器
	container: document.getElementById('shareContainer'),
	//flash文件地址
	flash_swf_url : 'lib/plupload-2.1.2/js/Moxie.swf',
	//silverlight文件地址
	silverlight_xap_url : 'lib/plupload-2.1.2/js/Moxie.xap',
	//上传服务器地址
    url : 'http://oss.aliyuncs.com',
    //选择文件扩展名的过滤器，每个过滤规则只有title和ext两项[{title:}]
    filters: filters1,
    //初始化plupload实例，添加监听对象
	init: {
		//init执行完之后要执行的事件触发
		PostInit: function() {
		},
		//用户选择文件时触发
		FilesAdded: function(up, files) {
			plupload.each(files, function(file) {
				document.getElementById('ossfile2').innerHTML += '<div   id="' + file.id + '"><b1></b1>'
				+'<div class="progress"><div class="progress-bar" style="width: 0%"></div></div>'
				+'</div>';
			});
			document.getElementById('postfiles2').click(); 
		},
		//文件上传完之前触发的事件
		BeforeUpload: function(up, file) {
            check_object_radio();
            shre_file_name = file.name;
            //console.log(file.name);
            set_upload_param(up, file.name, true,type,id);
        },
        //文件正在被上传中触发
		UploadProgress: function(up, file) {
//			var d = document.getElementById(file.id);
//			d.getElementsByTagName('b1')[0].innerHTML = '<span>' + file.percent + "%</span>";
//            var prog = d.getElementsByTagName('div')[0];
//			var progBar = prog.getElementsByTagName('div')[0];
//			progBar.style.width= 2*file.percent+'px';
//			progBar.setAttribute('aria-valuenow', file.percent);
		},
		//文件上传成功时触发
		FileUploaded: function(up, file, info) {
            if (info.status == 200)
            {	
            	uploaded_share_url = oss_url+'/' + get_uploaded_object_name(file.name);
            	document.getElementById("shareFileUrl").value = uploaded_share_url;
                document.getElementById('callback2').click(); 
            }
            else
            {
                document.getElementById(file.id).getElementsByTagName('b1')[0].innerHTML = info.response;
            } 
		},
		
		Error: function(up, err) {
            if (err.code == -600) {
            	var filters = up.getOption("filters");
            	alert("上传图片大于"+filters.max_file_size+"");
            	//parent.document.getElementById("productMsg").innerHTML = "上传视频大于30M！";
            	//parent.jquery("#myModal").modal('show');
            }
            else if (err.code == -601) {
            	var filters = up.getOption("filters");
            	var mime_types =  filters.mime_types;
            	var extensions = mime_types[0].extensions;
            	alert("图片格式不正确,请上传"+extensions+"格式的图片");
            	//parent.document.getElementById("productMsg").innerHTML = "视频格式不正确，请上传mp4、avi、rmvb、wmv、3gp、amv、dmv、rm格式的视频";
            	//parent.jquery("#myModal").modal('show');
            }
            else if (err.code == -602) {
            	//arent.document.getElementById("productMsg").innerHTML = "该视频已经上传过了！";
            	//parent.jquery("#myModal").modal('show');
            }
            else 
            {
            	alert(err.response);
            	//parent.document.getElementById("productMsg").innerHTML = "\nError xml:" + err.response;
            	//parent.jquery("#myModal").modal('show');
            }
		}
	}
});

uploader2.init();