; (function (root, factory, plug) {
	factory.call(root, root.jQuery, plug);
})(this, function ($, plug) {
	//default rule
	const _RULES = {
		"require": function () {
			return this.val() != "";
		},
		"email": function () {
			return /^([a-zA-Z0-9-_])+@([a-zA-Z0-9])+(.[a-zA-Z0-9])+/.test(this.val());
		},
		"mobile": function () {
			return /^1\d{10}$/.test(this.val());
		},
		"phone": function () {
			return /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/.test(this.val());
		},
		"regex": function () {
			return new RegExp(this.data(_CONST.ABBR + arguments[0])).test(this.val());
		},
		"equal": function () {
			const eq = $(this.data(_CONST.ABBR + arguments[0]));
			if (!eq.val()) return true;
			if (eq.val() === this.val()) {
				eq.parents(".form-group:first").removeClass("has-error").addClass("has-success");
				return true;
			} else {
				return false;
			}
		},

	};

	//Abbreviations
	const _CONST = {
		ABBR: "bv-",
		MESSAGE: "-message"
	};

	//default object
	const _DEFS = {
		raise: "change",
		errMsg: "* 校验不合法",
		extendRules: function (rule) {
			$.extend(_RULES, rule);
		}
	};

	$.fn[plug] = function (opts) {
		if (this.is("form")) {
			const _this = this;
			$.extend(this, _DEFS, opts); //extend form
			const $fields = this.find(":input").not(":button,:submit,:reset");
			$fields.on(this.raise, function () {
				const field = $(this);
				const $group = field.parents(".form-group:first").removeClass("has-error has-success");
				$group.find(".help-block").remove();
				let result = false;
				let message = _this.errMsg;
				//iterate rules
				$.each(_RULES, function (rule, valid) {
					if (field.data(_CONST.ABBR + rule)) {
						result = valid.call(field, rule);
						message = field.data(_CONST.ABBR + rule + _CONST.MESSAGE) || _this.errMsg;
						$group.addClass(result ? "has-success" : "has-error");
						if (!result) {
							field.after("<span class=\"help-block\">" + message + "<span>");
							//handle tab
							if (field.is(":hidden")) {
								const index = field.parents(".tab-pane").index();
								field.parents(".tab-content").prev().find("a").eq(index).tab('show');
							}
						}
						return result;
					}
				});
			});
			//intercept submit
			this.on("submit", function () {
				//trigger valide event
				$fields.trigger(_this.raise);
				if ($fields.parents(".form-group.has-error").size() === 0) {
					this.submit();
				}
				return false;
			});
			//return form so can extend extra rule
			return this;
		} else {
			throw new Error("目标必须为表单元素");
		}
	}
}, "bootstrapValidator")




/**
 * todo
 * 1 表单元素分块提示
 * 2 没有国际化
 * 3 异步校验
 * 4 异步表单提交
 */