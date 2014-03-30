<div class="{{ className }}" ng-class="{
		'add-offer-comment': !active,
		'add-offer-comment--active': active
	}">
	<app-add-comment
		comment="comment"
		comment-parent="commentParent"
		on-submit="addComment(comment)"
		show-owner-features="showOwnerFeatures()"
		author="author">
		<button
			class="add-offer-comment__response"
			ng-if="!comment.parent && !showOwnerFeatures()"
			ng-click="addResponse()">
			{{ i18n.offer.response }}
		</button>
	</app-add-comment>
</div>