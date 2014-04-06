<form class="add-comment">
	<fieldset>
		<legend>{{ i18n.comments.add.header }}</legend>

		<div class="add-comment__wrapper"
			app-fixed>
			<div class="add-comment__header">
				<div class="add-comment__author">
					<div class="add-comment__author__avatar">
						<img
							ng-src="/images/{{ author.userInfo.avatar.filename }}"
							height="40"
							width="40" />
					</div>
					<span class="add-comment__author__name">
						{{ author.userInfo.fullName }}
					</span>
				</div>

				<time
					class="add-comment__time"
					datetime="{{ currentTime | date:'yyyy-MM-ddTHH:mm:ssZ' }}">
					{{ currentTime | date:'EEEE, dd MMMM yyyy HH:mm:ss' }}
				</time>
			</div>

			<div class="add-comment__content">
				<textarea
					class="add-comment__input"
					name="addCommentInput"
					ng-model="comment.content"
					msd-elastic="\n"
					placeholder="{{ inputPlaceholder.text || i18n.comments.add.placeholder }}">
				</textarea>

				<div class="add-comment__extension" ng-transclude></div>

				<button
					class="add-comment__submit"
					ng-click="addComment()">
					{{ i18n.comments.add.submit }}
				</button>

				<button
					class="add-comment__cancel"
					ng-click="cancel()">
					{{ i18n.common.cancel }}
				</button>
			</div>
		</div>

	</fieldset>
</form>