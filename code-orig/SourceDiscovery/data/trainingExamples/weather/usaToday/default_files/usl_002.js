
usl.photoUploadUrl="http:/"+"/sitelife.usatoday.com/ver1.0/Photo/PhotoUploadFrame.rails"
usl.photoDetailsUrl="http:/"+"/sitelife.usatoday.com/ver1.0/Photo/PhotoAddDetails.rails"
usl.photoUploadTemplate="community/_templates/photoUploadsTemplate.htm"

usl.photoGalleryId='1dc910c1-36a8-4268-bf52-701fcce42d7d'
usl.photoChatter="Please contribute your photos to the USA TODAY photo galleries."
usl.photoGalleryImage="http:/"+"/images.usatoday.com/_common/photoUploadDefault.jpg"
usl.photoGallerySpike="<a href='http:/"+"/www.usatoday.com/photos/gallery.htm?gallery=0'>Visit the gallery</a>"
usl.photoUploadConfirm="Thank you for contributing your photo."
usl.photoUploadMore="Contribute another photo"
usl.PhotoUpload=function(){document.write("<div id='uslPhotoUpload' class='uslPhotoUpload'></div>")
usl._loadTemplate(usl.photoUploadTemplate,'photos',usl._loadPUTemplatesCallback)}
usl._loadPUTemplatesCallback=function(result){usl._templates.photos['loaded']=true
var url=usl.photoUploadUrl+"?plckGalleryId="+usl.photoGalleryId
var transport="<span style='visibility:hidden; position:absolute; top:100px; left:-1000px;'><iframe width='1' height='1' name='PhotoUploadIFrame' id='PhotoUploadIFrame' src='"+url+"' onload='setTimeout( \"usl.puStateChange()\", 1);'></iframe></span>"
$('uslPhotoUpload').parentNode.innerHTML+=transport

usatAuth.em.loginHandlers["slPhotoUpload"]=function(){usl.puReloadTransport()}
usatAuth.em.logoutHandlers["slPhotoUpload"]=function(){usl.puStateChange(true)}}

usl.DisplayPULoggedOut=function(){var data={'chatter':usl.photoChatter,
'chatterImage':"<img width='156' height='86' src='"+usl.photoGalleryImage+"' id='puChatterImage' />",
'spike':usl.photoGallerySpike}
$('uslPhotoUpload').innerHTML=usl._transform(data,usl._templates.photos.out)}

usl.DisplayPUUpload=function(error){error=(error)?error:" "
var data={'chatter':usl.photoChatter,
'chatterImage':"<img width='156' height='86' src='"+usl.photoGalleryImage+"' id='puChatterImage' />",
'spike':usl.photoGallerySpike,
'formAction':usl.photoDetailsUrl,
'galleryId':usl.photoGalleryId,
'error':error}
$('uslPhotoUpload').innerHTML=usl._transform(data,usl._templates.photos.upload)}

usl.DisplayPUDetails=function(error){var imageHTML="<img src='"+usl.uploadedImageUrl+"' width='156' height='86' id='puUserImage' />"
error=(error)?error:" "
var data={'image':imageHTML,
'error':error}
$('uslPhotoUpload').innerHTML=usl._transform(data,usl._templates.photos.details)
usl.fitImage('puUserImage',usl.uploadedImageWidth,usl.uploadedImageHeight,156,86)}

usl.DisplayPUConfirm=function(){var imageHTML="<img src='"+usl.uploadedImageUrl+"' width='156' height='86' id='puUserImage' />"
var data={'confirm':usl.photoUploadConfirm,
'spike':usl.photoGallerySpike,
'image':imageHTML,
'uploadmore':"<a href='#photo' onclick='usl.puReloadTransport();'>"+usl.photoUploadMore+"</a>"}
$('uslPhotoUpload').innerHTML=usl._transform(data,usl._templates.photos.confirm)
usl.fitImage('puUserImage',usl.uploadedImageWidth,usl.uploadedImageHeight,156,86)}
getElementsByClassName=function(className,parentNode){var children=parentNode.getElementsByTagName('*')
var elements=[],child
for(var i=0,length=children.length;i<length;i++){child=children[i]
if(Element.hasClassName(child,className))
elements.push(Element.extend(child))}
return elements}
usl.puStateChange=function(logout){if(logout==true||usl.isSignedIn()==false){usl.DisplayPULoggedOut()}else{var slDoc=usl.getIframeDocument('PhotoUploadIFrame')
if(!slDoc){usl.DisplayPULoggedOut()}else{var a=getElementsByClassName('PhotoUpload_FileBrowseInput',slDoc)
if(getElementsByClassName('PhotoUpload_FileBrowseInput',slDoc).length!=0){var puErr=getElementsByClassName('PhotoUpload_Error',slDoc)[0]
puErr=(typeof(puErr)!='undefined')?puErr.innerHTML:" "
usl.DisplayPUUpload(puErr)}else if(getElementsByClassName('PhotoAddDetail_DetailsField',slDoc).length!=0){var puImgUrl=slDoc.getElementById('photo[0].ImageUrl')
usl.uploadedImageUrl=(puImgUrl)?puImgUrl.value:null
usl.uploadedImageWidth=(slDoc.images[0])?slDoc.images[0].width:150
usl.uploadedImageHeight=(slDoc.images[0])?slDoc.images[0].height:90
var puErr=getElementsByClassName('PhotoUpload_Error',slDoc)[0]
puErr=(typeof(puErr)!='undefined')?puErr.innerHTML:" "
usl.DisplayPUDetails(puErr)}else if(getElementsByClassName('PhotoConfirmation_SectionHead',slDoc).length!=0){usl.DisplayPUConfirm()}else{usl.DisplayPUUpload('Unable to find Gallery')}}}}
usl.puSubmitImage=function(){$('uslPUUploadError').innerHTML="Uploading Image..."
try{$('uslPUUploadForm').submit()}catch(e){usl.DisplayPUUpload("Error: Unable to upload image."+e.message)
usl.showException("PhotoUpload submit image",e)}}
usl.puSubmitImageDetails=function(){$('uslPUDetailsError').innerHTML="Submitting Details..."
try{var slDoc=usl.getIframeDocument('PhotoUploadIFrame')
slDoc.getElementById('photo[0].Title').value=$('uslPUTitle').value
slDoc.getElementById('photo[0].Tags').value=$('uslPUTags').value
slDoc.getElementById('photo[0].Description').value=$('uslPUDesc').value

slDoc.forms[0].submit()}catch(e){usl.DisplayPUDetails("Error: Unable to submit image details.")
usl.showException("PhotoUpload submit details",e)}}
usl.puReloadTransport=function(){var url=usl.photoUploadUrl+"?plckGalleryId="+usl.photoGalleryId+"&rand="+(new Date()).getTime()
$('PhotoUploadIFrame').src=url}
usl.fitImage=function(id,origWidth,origHeight,fitWidth,fitHeight){if(origWidth!=fitWidth&&origHeight!=fitHeight&&origHeight!=0){var origRatio=origWidth / origHeight
var fitRatio=fitWidth / fitHeight
if(origRatio<fitRatio){$(id).width=fitHeight*origRatio
$(id).height=fitHeight}else{$(id).width=fitWidth
$(id).height=fitWidth / origRatio}}}
usl._templates={'photos':{'loaded':false}};