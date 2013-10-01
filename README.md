﻿Re_QA_ntf
=========

【QAテンプレート再作成】

一部のデータが、GitHub上にアップできなかったため、再作成を実施。

作成日：2013.06.11
最終更新日：2013.10.01

テンプレート名：QA_9p.ntf

■■■■■■■■■■■■■■

　　TOPIC

■■■■■■■■■■■■■■


　トップメニューは、「top.xsp」としています！！！


　　以下の画面が表示されるようになりました。

　　　・トップ（サンプル用のビュー）

　　　・ビューから質問・回答の閲覧

　　　・「ユーザー」の表示

　　※テンプレート内に文書も入れておきます。


■■■■■■■■■■■■■■

　　変更点

■■■■■■■■■■■■■■

■2013.10.01 西

・阿賀さん対応分のマージ
・西不具合対応
・質問投稿部分の追加


設計要素	設計名	区分	内容
xpage	x_anspage	変更	"「お気に入り」ボタンの追加。
閲覧数がカウントアップされない不具合の対応"
スクリプトライブラリ	Common_jss	変更	"「getCurrentUser」でのログインユーザーの取得方法の修正。
※統一できていない為、今後の課題"
スクリプトライブラリ	qa_JsLib	変更	"1：質問追加、2：回答履歴、3：お気に入り登録時にプロフィールへIDをセットする関数を追加
プロフィールへの更新「qa_JsLib.SetPersonHistory」"
イメージ	add.png	追加	タグ選択用のイメージ画像
スタイルシート	qa.css	変更	幅調整
カスタムコントロール	cc_QuestionEdit	追加	質問編集用に追加
カスタムコントロール	cc_QTable	変更	不具合対応（タグ項目)
カスタムコントロール	cc_AppLayout	変更	「新しい質問を投稿する」ボタンの表示条件の変更
カスタムコントロール	cc_Like	変更	「▲」「▼」ボタンの表示条件の変更
カスタムコントロール	cc_QAccount	変更	「いいね！」ユーザーがいない場合の対処を追加
カスタムコントロール	cc_UserProfile	変更	「詳細」リンクの追加
カスタムコントロール	cc_Atable	変更	「これで解決」が質問者以外でも表示されていた不具合を修正。
カスタムコントロール	cc_AAcount	変更	「いいね！」ユーザーがいない場合の対処を追加
カスタムコントロール	cc_AnserEdit	変更	回答投稿後、メインに移るように変更。



■2013.09.06 西
修正とプロフィール変更画面を追加しました。

----変更箇所----
 Pages
　　x_ProfileEdit	新規追加	プロフィール変更画面
 カスタムコントロール
　　cc_AppLayout	変更	リンク追加：「プロフィール変更」
　　cc_ProfileEdit	新規追加	
　　cc_UserEntry	変更	
　　cc_PasswordReissue	変更	
 スクリプトライブラリ	
　　xpCGIVariables	新規追加
　　
　　

■2013.08.08 西
追加の設計要素 
<ビュー>
(11.カテゴリ別_すべて)| V_Category_All 
　・「いいねカウント」列をユーザー名リスト「user_good」のelementsで判定するように変更
(12.カテゴリ別_未解決) |V_Category_Open 
(13.カテゴリ別_解決済み)| V_Category_Close 
<XPage >
x_Top 
　・top.xspへ移行。
　
<ｶｽﾀﾑｺﾝﾄﾛｰﾙ >
cc_View_Category
　・パネル「contentBody」がx_Topにあり、エラーとなった為、追加
　・ユーザー表示を「cc_UserProfile」を使って表示するように変更
　
　
　
【残課題】
　・カテゴリリストが固定になっている
　・回答数が取得できていない
　・ソートがうまく機能しない？
　
　　

■2013.07.26 西
　・「ユーザー」から全ユーザーリストがポイント順に表示されるように対応
  ・海老原さんが追加した「cc_AppLayout」を使って下記を表示。トップから以下の画面が表示できるように実施。
　　　・トップ（サンプル用のビュー）
　　　・ビューから質問・回答の閲覧
　　　・「ユーザー」の表示を実現

■2013.07.11 西



　・閲覧履歴へのログの出力


　　→下記のログを出力するように修正。

　　　　・いいね

　　　　・いいね解除

　　　　・これで解決

　　　　・これで解決解除
　　　　
　　　　【残】

　　　　ログをプロファイルDBへ反映させる定期エージェントを

　　　　作成する必要もある。



　・カテゴリ、タグ、ユーザーからのリンク

　　→未実施。




　・「これで解決！」後に、「解決済み」と分かるイメージの用意

　　→質問内容欄には、「済」を表示するようにイメージを追加。

　　　同様に「これで解決！」が必要。


　・「これで解決！」後に、回答ができないようにする。（コメントのみ可）

　　→対応済み

　・画面イメージの調整

　・入力チェック

　　→未実施。

　　　→コードはなくす。

　・「いいね！」数を「いいね!」ユーザーの値を使ってカウント


■2013.06.11 西

　・解決済イメージの追加

　・ユーザー表示用のカスタムコントロール「cc_UserProfile」を追加

　・いいねユーザーのリスト表示＋ユーザー情報の表示（仮)
