const socket = io()

const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocation = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML
const sidebarTemplate =document.querySelector('#sidebar-template').innerHTML
//Optiont
const  {username, room} = Qs.parse(location.search,{ignoreQueryPrefix :true})

const autoscroll = ()=>{
    //new message
    const $newMessage = $messages.lastElementChild
    
    //Hight of the new  message 
    const newMessageStyle = getComputedStyle($newMessage)
    const newMessageMagin = parseInt(newMessageStyle.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight +newMessageMagin

    console.log(newMessageMagin)

    //visible height 
    const visibleHeight = $messages.offsetHeight

    //Height of  messages container 
    const containerHeight = $messages.scrollHeight

    //how far have i scrolled
    const scrollOfsset = $messages.scrollTop + visibleHeight

    if(containerHeight - newMessageHeight <= scrollOfsset){
        $messages.scrollTop = $messages.scrollHeight
    }
    
}

socket.on("message",(message)=>{
    console.log(message)
    const html = Mustache.render(messageTemplate, {
        username : message.username,
        message : message.text,
        createdAt : moment(message.createdAt).format('h:mm a')
    })  
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

socket.on("locationMessage",(message)=>{
    console.log(message)
    const html = Mustache.render(locationMessageTemplate,{
        username : message.username,
        url : message.url,
        createdAt : moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML("beforeend",html)
    autoscroll()
})

socket.on('roomData',({room , users})=>{
    const html = Mustache.render(sidebarTemplate , {
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html
})
$messageForm.addEventListener('submit',(e)=>{
    e.preventDefault()
    $messageFormButton.setAttribute('disabled','disabled') 

    const message = e.target.elements.message.value

    socket.emit('sendMessage',message, (error)=>{

         $messageFormButton.removeAttribute('disabled')
         $messageFormInput.value =''
         $messageFormInput.focus()
       if(error){
           return console.log(error)
       }
       console.log('Message deliverd!')
    })

})

$sendLocation.addEventListener('click',()=>{
    if(!navigator.geolocation){
        return alert("Geolocation is not supported in your browser.")
    }
    $sendLocation.setAttribute('disabled','disabled')
    navigator.geolocation.getCurrentPosition((postion)=>{


        socket.emit('sendLocation',{
            latitude : postion.coords.latitude,
            longitude : postion.coords.longitude
        },()=>{
            $sendLocation.removeAttribute('disabled')
            console.log("Location shared!")
        })
    })
})

socket.emit('join',{username,room},(error)=>{
        if(error){
            alert(error)
            location.href='/'

        }
})