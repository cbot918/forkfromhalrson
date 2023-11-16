<template>
  <div class="modal fade" ref="DOM">
    <div class="modal-dialog" role="dialog">
      <Form class="modal-content" v-slot="{errors}" v-on:submit="addEditArticle" v-on:reset="hide">
        <div class="modal-header">{{article.id?'編輯':'新增'}}文章</div>
        <div class="modal-body container">
          <div class="row py-1">
            <div class="col-3">
              <label for="title">標題</label>
            </div>
            <div class="col-9">
              <Field label="標題" name="title" class="form-control" id="title" type="text" rules="required" v-model="article.title" v-bind:class="{'is-invalid':errors['title']}" />
              <ErrorMessage class="invalid-feedback" name="title" />
            </div>
          </div>
          <div class="row py-1">
            <div class="col-3">
              <label for="image">圖片</label>
            </div>
            <div class="col-9">
              <div>
                <label for="image" class="form-label">輸入圖片網址</label>
                <br />
                <p class="mb-3 input-group">
                  <Field label="網址" name="url" rules="url" type="text" class="form-control" id="image" aria-describedby="addImage" placeholder="請輸入圖片連結"
                         v-model="tempUrl" v-bind:standalone="true" v-bind:class="{'is-invalid':errors['url']}" />
                  <button id="addImage" type="button" class="btn btn-outline-primary btn-sm"
                          v-on:click="addImage(tempUrl,url=>article.image=url)" v-bind:disabled="!tempUrl">
                    新增圖片
                  </button>
                </p>
                <ErrorMessage class="invalid-feedback" name="url" />
              </div>
              <div class="mb-3">
                <label for="input" class="form-label">或上傳圖片</label>
                <Field class="form-control" name="file" type="file" rules="image" label="選取檔案"
                  v-on:change="event=>UploadImage(event.target.files,url=>article.image=url)" v-bind:class="{'is-invalid':errors['file']}" />
                <ErrorMessage name="file" class="invalid-feedback" v-bind:style="{'display':errors['file']?'block':'none'}" />
              </div>
            </div>
          </div>
          <div class="row py-1">
            <div class="col-3">
              <label for="tag">標籤</label>
            </div>
            <div class="col-9">
              <p>
                <span class="badge rounded-pill bg-secondary" v-for="tag in article.tag" v-bind:key="tag">
                  {{tag}}
                  <button type="button" class="btn-close" aria-label="Close" v-on:click="removeTag(tag)"></button>
                </span>
              </p>
              <input class="form-control" id="tag" type="text" v-model="tempTag" v-on:change="addTag(tempTag)" />
            </div>
          </div>
          <div class="row py-1">
            <div class="col-3">
              <label for="description">描述</label>
            </div>
            <div class="col-9">
              <textarea class="form-control" id="description" rows="2" cols="40" v-model="article.description" />
            </div>
          </div>
          <div class="row py-1">
            <div class="col-3">
              <label for="content">內容</label>
            </div>
            <div class="col-9">
              <Field label="內容" as="textarea" name="content" class="form-control" id="content" rows="2" cols="40" rules="required"
                v-model="article.content" v-bind:class="{'is-invalid':errors['content']}" />
              <ErrorMessage class="invalid-feedback" name="content" />
            </div>
          </div>
          <div class="row py-1">
            <div class="col-3">
              <label for="author">作者</label>
            </div>
            <div class="col-9">
              <Field label="作者" name="author" class="form-control" id="author" type="text" rules="required" v-model="article.author" v-bind:class="{'is-invalid':errors['author']}" />
              <ErrorMessage class="invalid-feedback" name="author" />
            </div>
          </div>
          <div class="row">
            <div class="col">
              <label class="form-check-label" for="public">是否公開</label>
            </div>
            <div class="col">
              <Field label="是否公開" name="public" class="form-check-input" id="public" type="checkbox"
                     v-model="article.isPublic" v-bind:value="true" v-bind:unchecked-value="false" v-bind:class="{'is-invalid':errors['public']}" />
              <ErrorMessage class="invalid-feedback" name="public" />
            </div>
            <div class="col">
              <label for="date">建立日期</label>
            </div>
            <div class="col">
              <Field label="建立日期" name="date" class="form-control" id="date" type="date" rules="required"
                v-model="_date.toISOString().split('T')[0]" v-bind:class="{'is-invalid':errors['date']}" />
              <ErrorMessage class="invalid-feedback" name="date" />
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="submit" class="btn btn-primary">確定</button>
          <button type="reset" class="btn btn-danger">取消</button>
        </div>
      </Form>
    </div>
  </div>
</template>
<script setup>
  import { onMounted, ref, watch } from 'vue'
  import { Modal } from 'bootstrap'
  import { storeToRefs } from 'pinia'
  import { addImage, uploadImage as UploadImage } from "../util"
  import useArticleStore from "@/stores/articles"
  const DOM = ref(null), tempUrl = ref(''), tempTag = ref(''), prop = defineProps(['id'])
  const ArticleStore = useArticleStore(), { addArticle, editArticle, getArticle } = ArticleStore, { article } = storeToRefs(ArticleStore)
  let modal, _date = new Date()
  onMounted(function () {
    modal = new Modal(DOM.value)
  })
  watch(
    () => prop.id,
    async function (newValue) {
      if (newValue) {
        await getArticle(newValue, 'admin')
        tempUrl.value = article.value.image        
        _date.setTime(article.value.create_at)
      }
    },
    { deep: true }
  )
  defineExpose({ show })
  function show () { modal.show() }
  function hide () { modal.hide() }
  function addTag (tagName) {
    article.value.tag||=[]
    article.value.tag.push(tempTag.value)
    tempTag.value = ''
  }
  function removeTag (tagName) {
    article.value.tag.splice(article.value.tag.indexOf(tagName), 1)
  }
  function addEditArticle () {
    article.value.create_at = _date.getTime()
    if (article.value.id) { editArticle(article) } else { addArticle(article) }
    hide()
  }
</script>
