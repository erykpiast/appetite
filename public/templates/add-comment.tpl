<form class="add-comment">
	<fieldset>
		<legend>{{ i18n.addComment.header }}</legend>

		<p class="add-comment__answer-prelude" ng-if="!!comment.parent">
			{{ i18n.offer.comment.answerPrelude }}
			<strong  class="add-comment__answer-prelude__parent-author">{{ comment.parent.author.fullName }}</strong> <br/>
			<span class="add-comment__answer-prelude__parent-content">{{ comment.parent.content }}</span>
			<button class="add-comment__answer-prelude__clear" ng-click="clearAnswer()">{{ i18n.offer.comment.clearAnswer }}</button>
		</p>
		<textarea class="add-comment__input" ng-model="comment.content" placeholder="{{ i18n.addComment.placeholder }}"></textarea>

		<button class="add-comment__response" ng-if="!comment.parent && !showOwnerFeatures()" ng-click="response()">{{ i18n.addComment.response }}</button>
		<button class="add-comment__submit" ng-click="addComment()">{{ i18n.addComment.submit }}</button>

	</fieldset>
</form>