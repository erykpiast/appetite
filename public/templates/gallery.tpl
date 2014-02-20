<section class="photo-gallery">
	<ul class="photo-gallery__wrapper"
		perfect-scrollbar="{
			suppressScrollY: true,
			useBothWheelAxes: true
		}">
		<li class="photo-gallery__photo" ng-repeat="photo in photos">
			<img ng-src="/static/images/{{ photo.filename }}" alt="" />
		</li>
	</ul>	
</section>
