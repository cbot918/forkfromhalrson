import {http} from "../util"
import { useRouter } from "vue-router"
export default function(){
  const token=document.cookie.split(";").find(str=>str.startsWith("hextoken")).slice(9)
  const router=useRouter()
  http.defaults.headers.common.Authorization=token
  http.post('/api/user/check')
    .then(function(response){
      if(!response.data.success) router.push({path: '/login'})
    })
}