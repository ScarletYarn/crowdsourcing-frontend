<template>
  <div class="page-body">
    <div class="header-section">
      <div class="title-container">
        <div class="title">人工智能</div>
        <div class="badge">词条</div>
        <div class="icon">
          <i class="el-icon-s-home" @click="$router.push('/kb/home')"></i>
        </div>
      </div>
      <div class="relative">共检索到300个相关词条</div>
      <div class="link">API：<span>https://xxx.xxx.xxx/api/getEntity?eid=1</span></div>
    </div>
    <div class="body-section">
      <div class="body-title">【人工智能】作为头实体</div>
      <div class="item-area">
        <div class="relation-cell" v-for="(item, index) in headTriples" :key="index">
          <div class="relation">{{ item.rel }}</div>
          <div class="item" v-for="(subItem, subIndex) in item.tails" :key="subIndex">
            {{ subItem }}
          </div>
          <div class="more-link" v-if="item.hasMore"><span>More >></span></div>
        </div>
      </div>
      <div class="divide-line"></div>
      <div class="body-title">【人工智能】作为尾实体</div>
      <div class="item-area">
        <div class="relation-cell" v-for="(item, index) in tailTriples" :key="index">
          <div class="relation">{{ item.rel }}</div>
          <div class="item" v-for="(subItem, subIndex) in item.tails" :key="subIndex">
            {{ subItem }}
          </div>
          <div class="more-link" v-if="item.hasMore"><span>More >></span></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Entity',
  data() {
    return {
      headTriples: [
        {
          rel: 'HasA',
          tails: new Array(4).fill('人工智能'),
          hasMore: true
        },
        {
          rel: 'IsA',
          tails: new Array(2).fill('人工智能'),
          hasMore: false
        },
        {
          rel: 'DefinedAs',
          tails: new Array(3).fill('人工智能'),
          hasMore: false
        },
        {
          rel: 'RelatedTo',
          tails: new Array(4).fill('人工智能'),
          hasMore: true
        }
      ],
      tailTriples: [
        {
          rel: 'PartOf',
          tails: new Array(3).fill('人工智能'),
          hasMore: false
        },
        {
          rel: 'CreatedBy',
          tails: new Array(3).fill('人工智能'),
          hasMore: false
        }
      ]
    }
  }
}
</script>

<style scoped lang="sass">
@mixin external
  cursor: pointer
  text-decoration: underline

.page-body
  width: 100%
  height: 100%
  box-sizing: border-box
  padding: 2em 5%
  background-color: rgba(177, 147, 147, .17)
  overflow-y: scroll

.header-section
  margin-bottom: 16px

.header-section, .body-section
  border: 1px solid rgb(187, 187, 187)
  background-color: #ffffff

.title-container
  display: flex
  flex-direction: row
  align-items: center

  .title
    font-size: 32px
    margin: .5em .5em .5em .8em

  .badge
    font-size: 12px
    padding: .5em 1em
    color: rgba(16, 16, 16, .71)
    border-radius: 15px 15px 15px 15px
    background-color: rgba(166, 255, 246, 1)
    border: 1px solid rgba(115, 97, 97, 1)

  .icon
    flex-grow: 1
    text-align: end
    align-self: start
    padding: .5em
    font-size: 24px

    i
      cursor: pointer

.relative, .link
  text-align: start
  margin-left: 26px

.relative
  color: rgba(111, 99, 99, 1)
  font-size: 16px

.link
  color: rgba(111, 99, 99, 1)
  font-size: 12px
  margin-top: 1em
  margin-bottom: 2em

  span:hover
    @include external

.body-title
  color: #101010
  text-align: start
  margin-top: 1em
  text-indent: 2em
  font-size: 14px

.divide-line
  border-top: dashed 1px #BBBBBB
  height: 0

.item-area
  display: flex
  flex-direction: row
  flex-wrap: wrap

.relation-cell
  text-align: start
  box-sizing: border-box
  padding: 2em 4%
  width: 25%

  .relation
    font-size: 18px
    margin-bottom: .8em

  .item
    font-size: 14px
    margin-bottom: .5em
    color: #6F6363

.more-link
  margin-top: 1em
  color: #4F4141

  span:hover
    @include external
</style>
