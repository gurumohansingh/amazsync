Ext.define('ExtThemeCodaxyCore.panel.Panel',{
	override: 'Ext.panel.Panel',
	initComponent: function() {
		
		this.callParent();
      var me = this,
          header = me.header,
          title = me.getTitle(),
          tools = me.tools,
          icon = me.getIcon(),
          glyph = me.getGlyph(),
          iconCls = me.getIconCls(),
          hasIcon = glyph || icon || iconCls,

          headerPosition = me.getHeaderPosition();

		if (Ext.isObject(header) || (header !== false && (title || hasIcon) ||
		                (tools && tools.length) || me.collapsible || me.closable)) {
		        this.cls = 'cx-header-docked-' + this.headerPosition + ' ' + this.cls;        	
		}

	}

})