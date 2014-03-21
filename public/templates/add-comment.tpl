<form class="add-comment">
	<fieldset>
		<legend>{{ i18n.comments.add.header }}</legend>

		<p class="add-comment__answer-prelude" ng-if="!!commentParent.comment">
			{{ i18n.comments.add.answerPrelude }}

			<strong class="add-comment__answer-prelude__parent-author">
				{{ commentParent.comment.author.fullName }}
			</strong>
			<br/>
			<span class="add-comment__answer-prelude__parent-content">
				{{ commentParent.comment.content }}
			</span>

			<button
				class="add-comment__answer-prelude__clear"
				ng-click="clearAnswer()">
				{{ i18n.comments.add.clearAnswer }}
			</button>
		</p>

		<textarea
			class="add-comment__input"
			ng-model="comment.content"
			placeholder="{{ i18n.comments.add.placeholder }}">
		</textarea>

		<button
			class="add-comment__submit"
			ng-click="addComment()">
			{{ i18n.comments.add.submit }}
		</button>

		<div class="add-comment__extension" ng-transclude></div>

	</fieldset>
</form>