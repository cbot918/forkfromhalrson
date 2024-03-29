import { defineStore, storeToRefs } from "pinia"
import { http } from "../util"
import { ref } from "vue"
import useLoadingStore from "@/stores/loading"
import useMessageStore from "@/stores/messages"
export default defineStore(
  'articles',
  () => {
    const { isLoading } = storeToRefs(useLoadingStore())
    const { pushMessage } = useMessageStore()
    const articles = ref([]), article = ref({}), pagination = ref({})
    function addArticle (article) {
      http.post(
        `/api/${import.meta.env.VITE_PATH}/admin/article`,
        { data: article.value }
      ).then(function (response) {
        if (response.data.success) {
          pushMessage('success', response.data.message)
        } else {
          response.data.message.forEach(msg => { pushMessage('danger', '新增文章失敗', msg) })
        }
      }).catch(function (error) {
        pushMessage('danger', '新增文章失敗', error?.message)
      }).finally(function () { getArticles(1, 'admin') })
    }
    function editArticle (article) {
      http.put(
        `/api/${import.meta.env.VITE_PATH}/admin/article/${article.value.id}`,
        { data: article.value }
      ).then(function (response) {
        if (response.data.success) {
          pushMessage('success', response.data.message)
        } else {
          response.data.message.forEach(msg => { pushMessage('danger', '編輯文章失敗', msg) })
        }
      }).catch(function (error) {
        pushMessage('danger', '編輯文章失敗', error?.message)
      }).finally(function () { getArticles(1, 'admin') })
    }
    function getArticle (id, role) {
      isLoading.value = true
      http.get(role === 'admin' ? `/api/${import.meta.env.VITE_PATH}/admin/article/${id}` : `/api/${import.meta.env.VITE_PATH}/article/${id}`)
        .then(function (response) {
          if (response.data.success) {
            article.value = response.data.article
            isLoading.value = false
          }
        })
    }
    function getArticles (page, role) {
      isLoading.value = true
      articles.value = []
      http.get(
        role === 'admin' ? `/api/${import.meta.env.VITE_PATH}/admin/articles` : `/api/${import.meta.env.VITE_PATH}/articles`,
        { params: { page } }
      ).then(function (response) {
        if (response.data.success) {
          articles.value =response.data.articles
          pagination.value = response.data.pagination
          isLoading.value = false
        }
      }
      )
    }
    function removeArticle(){
      http.delete(`/api/${import.meta.env.VITE_PATH}/admin/article/${article.value.id}`)
      .then(function(response){
        if(response.data.success){pushMessage('success',response.data.message)}
        else{response.data.message.forEach(msg=>pushMessage('danger',msg))}
      }).catch(function (error) {
        pushMessage('danger', '刪除文章失敗', error?.message)
      }).finally(function () { getArticles(1, 'admin') })
    }
    return { article, articles, pagination, addArticle, editArticle, getArticle, getArticles,removeArticle }
  },
  {
    persist: true,
  }
)