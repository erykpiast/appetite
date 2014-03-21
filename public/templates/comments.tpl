<ul ng-class="listClassName">
    <li ng-class="listElementClassName"
    	ng-repeat="comment in comments">
    	<app-comment
    		model="comment"
            on-answer="answerTo(comment)"
    		show-owner-features="showOwnerFeatures()"
            show-user-features="showUserFeatures()">
    	</app-comment>
        <app-comments
        	model="comment.children"
            on-answer="answerTo(comment)"
            show-owner-features="showOwnerFeatures()"
            show-user-features="showUserFeatures()"
            list-class-name="{{ listClassName }}"
            list-element-class-name="{{ listElementClassName }}">
          </app-comments>
    </li>
</ul>