<ul ng-class="listClassName">
    <li ng-class="listElementClassName"
    	ng-repeat="comment in comments">
    	<app-comment
    		model="comment"
    		class-names="classNames"
    		show-owner-features="showOwnerFeatures()"
            show-user-features="showUserFeatures()">
    	</app-comment>
        <app-comments
        	model="offer.comments"
            show-owner-features="showOwnerFeatures()"
            show-user-features="showUserFeatures()"
            list-class-name="istClassName"
            list-element-class-name="listElementClassName">
          </app-comments>
    </li>
</ul>