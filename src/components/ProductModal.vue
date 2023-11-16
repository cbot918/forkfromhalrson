<template>
  <div class="modal fade" tabindex="-1" ref="DOM">
    <div class="modal-dialog modal-xl" role="dialog">
      <Form class="modal-content border-0" v-slot="{errors}" v-on:submit="addOrEditProduct" v-on:reset="hide">
        <div class="modal-header bg-dark text-white">
          <h5 class="modal-title" id="exampleModalLabel">
            <span>{{product.id?'變更':'新增'}}產品</span>
          </h5>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col-sm-4">
              <div>
                <label for="image" class="form-label">輸入圖片網址</label>
                <br />
                <p class="mb-3 input-group">
                  <Field label="圖片網址" name="url" rules="url" type="text" class="form-control" id="image" aria-describedby="addImage" placeholder="請輸入圖片連結"
                     v-model="tempUrl" v-bind:standalone="true" v-bind:class="{'is-invalid':errors['url']}"/>
                  <button id="addImage" type="button" class="btn btn-outline-primary btn-sm"
                    v-on:click="AddImage(tempUrl, url => addImage(url))" v-bind:disabled="!tempUrl">
                    新增圖片
                  </button>
                </p>
                <ErrorMessage class="invalid-feedback" name="url" />
              </div>
              <div class="mb-3">
                <label for="input" class="form-label">或上傳圖片</label>
                <Field class="form-control" name="file" type="file" rules="image" label="選取檔案"
                  v-on:change="event=>UploadImage(event.target.files,url=>addImage(url))" v-bind:standalone="true"/>
                <ErrorMessage name="file" class="invalid-feedback" v-bind:style="{'display':errors['file']?'block':'none'}"/>
              </div>
              <!-- 延伸技巧，多圖 -->
              <div class="mt-5 mb-3 input-group">
                <div class="mb-3 input-group" v-show="product.imageUrl">
                  主圖片
                  <input type="url" class="form-control" readonly v-bind:value="product.imageUrl" placeholder="請輸入連結">
                  <button type="button" class="btn btn-outline-danger" v-on:click="delete product.imageUrl">
                    移除
                  </button>
                </div>
                <div class="mb-3 input-group" v-for="url,index in product.imagesUrl" v-bind:key="index">
                  副圖片{{index+1}}
                  <input type="url" class="form-control" readonly placeholder="請輸入連結" v-bind:value="url" />
                  <button type="button" class="btn btn-outline-danger" v-on:click="product.imagesUrl.splice(index,1)">
                    移除
                  </button>
                </div>
              </div>
            </div>
            <div class="col-sm-8">
              <div class="mb-3">
                <label for="title" class="form-label">標題</label>
                <Field type="text" class="form-control" id="title" label="標題" name="title" rules="required" placeholder="請輸入標題"
                       v-model="product.title"  v-bind:class="{'is-invalid':errors['title']}"/>
                <ErrorMessage class="invalid-feedback" name="title" />
              </div>
              <div class="row gx-2">
                <div class="mb-3 col-md-6">
                  <label for="category" class="form-label">分類</label>
                  <Field type="text" class="form-control" id="category" rules="required" placeholder="請輸入分類" label="分類" name="category"
                         v-model="product.category"  v-bind:class="{'is-invalid':errors['category']}"/>
                  <ErrorMessage class="invalid-feedback" name="category" />
                </div>
                <div class="mb-3 col-md-6">
                  <label for="price" class="form-label">單位</label>
                  <Field type="text" class="form-control" id="unit" label="單位" name="unit" rules="required" placeholder="請輸入單位"
                         v-model="product.unit"  v-bind:class="{'is-invalid':errors['unit']}"/>
                  <ErrorMessage class="invalid-feedback" name="unit" />
                </div>
              </div>
              <div class="row gx-2">
                <div class="mb-3 col-md-6">
                  <label for="origin_price" class="form-label">原價</label>
                  <Field type="number" class="form-control" id="origin_price" min="1" rules="required|integer" placeholder="請輸入原價" label="原價" name="origin_price"
                         v-model="product.origin_price"  v-bind:class="{'is-invalid':errors['origin_price']}"/>
                  <ErrorMessage class="invalid-feedback" name="origin_price" />
                </div>
                <div class="mb-3 col-md-6">
                  <label for="price" class="form-label">售價</label>
                  <Field type="number" class="form-control" id="price" min="1" label="售價" name="price" rules="required|integer" placeholder="請輸入售價"
                         v-model="product.price" v-bind:max="product.price"  v-bind:class="{'is-invalid':errors['price']}"/>
                  <ErrorMessage class="invalid-feedback" name="price" />
                </div>
              </div>
              <hr>
              <div class="mb-3">
                <label for="description" class="form-label">產品描述</label>
                <textarea type="text" class="form-control" id="description"
                          placeholder="請輸入產品描述" v-model="product.description"></textarea>
              </div>
              <div class="mb-3">
                <label for="content" class="form-label">說明內容</label>
                <textarea type="text" class="form-control" id="content"
                          placeholder="請輸入產品說明內容" v-model="product.content"></textarea>
              </div>
              <div class="mb-3">
                <div class="form-check">
                  <input class="form-check-input" type="checkbox"
                         v-bind:true-value="1" v-bind:false-value="0"
                         id="is_enabled" v-model="product.is_enabled" />
                  <label class="form-check-label" for="is_enabled">
                    是否啟用
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="submit" class="btn btn-primary">確認</button>
          <button type="reset" class="btn btn-danger">取消 </button>
        </div>
      </Form>
    </div>
  </div>
</template>
<script setup>
  import { Modal } from "bootstrap"
  import { storeToRefs } from "pinia"
  import { defineExpose, onMounted, ref, watch } from "vue"
  import useProductStore from "@/stores/products"
  import useLoadingStore from "@/stores/loading"
  import useMessageStore from "@/stores/messages"
  import { uploadImage as UploadImage, addImage as AddImage } from "../util"
  const tempUrl = ref(''), DOM = ref(null), prop = defineProps(['id'])
  const ProductStore = useProductStore(), { getProduct, addProduct, editProduct } = ProductStore, { product } = storeToRefs(ProductStore)
  let modal
  onMounted(function () {
    modal = new Modal(DOM.value)
})
  defineExpose({ show })
  watch(
    () => prop.id,
    function (newValue) {
      if (newValue) {
        getProduct(newValue)
      } else { product.value = {} }
    }, { deep: true }
  )
  function addImage (url) {
    if (product.value.imageUrl) {
      product.value.imagesUrl ||= []
      product.value.imagesUrl.push(url)
    } else { product.value.imageUrl = url }
    tempUrl.value=''
  } 
  function addOrEditProduct () {
    if (product.value.id) { editProduct() } else { addProduct() }
    hide()
  }
  function cancel(){
    hide()
  }
  function show () { modal.show() }
  function hide () { modal.hide() }
</script>
<style scoped>
  .loading {
    width: 100%;
    height: 100%;
  }
</style>