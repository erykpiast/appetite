<form class="add-comment">
	<fieldset>
		<legend>{{ i18n.addComment.header }}</legend>

		<textarea class="add-comment__input" ng-model="comment.content" placeholder="{{ i18n.addComment.placeholder }}"></textarea>

		<button class="add-comment__response" ng-click="response()">{{ i18n.addComment.response }}</button> <button class="add-comment__submit" ng-click="addComment()">{{ i18n.addComment.submit }}</button>

	</fieldset>
</form>