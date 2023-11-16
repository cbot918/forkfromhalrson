<template>
  <loading v-bind:is-full-page="true" v-bind:active="isLoading" />
  <div class="container position-relative">
    <div class="position-absolute h-100"></div>
    <Form class="row justify-content-center" v-slot="{errors}" v-on:submit="login">
      <div class="col-md-6">
        <h1 class="h3 my-3 font-weight-normal">請先登入</h1>
        <div class="mb-2">
          <label for="inputEmail" class="sr-only">Email address</label>
          <Field type="email"
                 id="inputEmail"
                 class="form-control"
                 placeholder="Email address"
                 rules="required"
                 name="username"
                 v-model="user.username"
                 v-bind:class="{'is-invalid':errors['username']}"
            />
            <ErrorMessage name="username" class="invalid-feedback"/>
        </div>
        <div class="mb-2">
          <label for="inputPassword" class="sr-only">Password</label>
          <Field type="password"
                 id="inputPassword"
                 class="form-control"
                 placeholder="Password"
                 name="password"
                 rules="required" 
                 v-model="user.password"
                 v-bind:class="{'is-invalid':errors['password']}"/>
          <ErrorMessage name="password" class="invalid-feedback" />
        </div>
        <div class="text-end my-4">
          <button class="btn btn-lg btn-primary btn-block" type="submit">登入</button>
        </div>
      </div>
    </Form>
  </div>
</template>
<script setup>
import { reactive } from "vue";
import { useRouter } from "vue-router";
  import useLoadingStore from "@/stores/loading"
  import { storeToRefs } from 'pinia'
  import { http } from "../../util";
  const { isLoading } = storeToRefs(useLoadingStore())
const user=reactive({
  username: '',
  password: ''
})
const router=useRouter()
isLoading.value=true
setTimeout(
  function(){ isLoading.value=false},
  1000
)
function login() {
  http.post(
    '/admin/signin', {
    username: user.username,
    password: user.password
  }).then(function (response) {
    if (response.data.success) {
      document.cookie=`hextoken=${response.data.token};expires=${new Date(response.data.expired).toUTCString()};SameSite=None`
      router.push({ path: '/admin/product' })
    }
  })
}
</script>
<style scoped>
  .position-absolute {
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-image: url(https://images.unsplash.com/photo-1480399129128-2066acb5009e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1920&q=80);
    background-position: center center;
    opacity: 0.1;
    z-index:-1;
  }
</style>