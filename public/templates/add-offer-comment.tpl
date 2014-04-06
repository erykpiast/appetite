<div class="{{ className }}" ng-class="{
		'add-offer-comment': activeMode !== 'response',
		'add-offer-comment--response': activeMode === 'response',
		'active': activeMode
	}">
	<app-add-comment
		comment="comment"
		comment-parent="commentParent"
		on-submit="addComment(comment)"
		on-submit-try="activeMode = 'comment'"
		on-cancel="cancel()"
		show-owner-features="showOwnerFeatures()"
		input-placeholder="inputPlaceholder"
		author="author">
		<button
			class="add-offer-comment__response"
			ng-if="!comment.parent && !showOwnerFeatures()"
			ng-click="addResponse()">
			{{ i18n.offer.response.action }}
		</button>
	</app-add-comment>
</div>