Ext.define('ExtThemeCodaxyCore.tab.Panel',{
	override: 'Ext.tab.Panel',
	
	initComponent: function() {
		
		this.callParent();

		if(this.tabBarHeaderPosition >= 0) {
			this.cls = 'cx-header-tabbar ' + this.cls;
		}
		
		if(this.plain) {
			this.cls = 'cx-header-tabbar-plain ' + this.cls;
		}

        //class for removing panel-body border
        this.cls = 'cx-tab-position-' + this.tabPosition + ' ' + this.cls;

        //class for inheritance
        if (this.ui !== 'default') {
            this.cls = 'cx-ui-defined ' + this.cls;
        }

	}

})