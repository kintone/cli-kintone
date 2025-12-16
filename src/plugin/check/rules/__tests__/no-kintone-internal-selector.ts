import { RuleTester } from "eslint";
import noKintoneInternalSelector from "../no-kintone-internal-selector";

const tester = new RuleTester();
tester.run("no-kintone-internal-selector", noKintoneInternalSelector, {
  valid: [
    `element.querySelector('.foo')`,
    `element.querySelectorAll('.foo')`,
    `querySelector('.foo')`,
    `querySelectorAll('.foo')`,
    `$('.foo')`,
    `$(document).on('click', '.foo', handler)`,
  ],
  invalid: [
    // .gaia-argoui-*
    {
      code: `element.querySelector('.gaia-argoui-foo')`,
      errors: [
        {
          message:
            "Using internal kintone UI class name `gaia-argoui-foo` is not allowed.",
        },
      ],
    },
    {
      code: `element.querySelector('.foo > .gaia-argoui-foo')`,
      errors: [
        {
          message:
            "Using internal kintone UI class name `gaia-argoui-foo` is not allowed.",
        },
      ],
    },
    {
      code: `element.querySelectorAll('.gaia-argoui-foo')`,
      errors: [
        {
          message:
            "Using internal kintone UI class name `gaia-argoui-foo` is not allowed.",
        },
      ],
    },
    {
      code: `element.querySelectorAll('.foo.gaia-argoui-foo')`,
      errors: [
        {
          message:
            "Using internal kintone UI class name `gaia-argoui-foo` is not allowed.",
        },
      ],
    },
    {
      code: `element.getElementsByClassName('gaia-argoui-foo')`,
      errors: [
        {
          message:
            "Using internal kintone UI class name `gaia-argoui-foo` is not allowed.",
        },
      ],
    },
    {
      code: `element.getElementsByClassName('foo gaia-argoui-foo')`,
      errors: [
        {
          message:
            "Using internal kintone UI class name `gaia-argoui-foo` is not allowed.",
        },
      ],
    },
    {
      code: `$('.gaia-argoui-foo')`,
      errors: [
        {
          message:
            "Possible use of internal kintone UI class name `gaia-argoui-foo`.",
        },
      ],
    },
    {
      code: `$(document).on('click', '.gaia-argoui-foo', handler)`,
      errors: [
        {
          message:
            "Possible use of internal kintone UI class name `gaia-argoui-foo`.",
        },
      ],
    },
    // .*-gaia
    {
      code: `element.querySelector('.foo-gaia')`,
      errors: [
        {
          message:
            "Using internal kintone UI class name `foo-gaia` is not allowed.",
        },
      ],
    },
    {
      code: `element.querySelector('.foo > .foo-gaia')`,
      errors: [
        {
          message:
            "Using internal kintone UI class name `foo-gaia` is not allowed.",
        },
      ],
    },
    {
      code: `element.querySelectorAll('.foo-gaia')`,
      errors: [
        {
          message:
            "Using internal kintone UI class name `foo-gaia` is not allowed.",
        },
      ],
    },
    {
      code: `element.querySelectorAll('.foo.foo-gaia')`,
      errors: [
        {
          message:
            "Using internal kintone UI class name `foo-gaia` is not allowed.",
        },
      ],
    },
    {
      code: `element.getElementsByClassName('foo-gaia')`,
      errors: [
        {
          message:
            "Using internal kintone UI class name `foo-gaia` is not allowed.",
        },
      ],
    },
    {
      code: `element.getElementsByClassName('foo foo-gaia')`,
      errors: [
        {
          message:
            "Using internal kintone UI class name `foo-gaia` is not allowed.",
        },
      ],
    },
    {
      code: `$('.foo-gaia')`,
      errors: [
        {
          message: "Possible use of internal kintone UI class name `foo-gaia`.",
        },
      ],
    },
    {
      code: `$(document).on('click', '.foo-gaia', handler)`,
      errors: [
        {
          message: "Possible use of internal kintone UI class name `foo-gaia`.",
        },
      ],
    },
    // kintone-*
    {
      code: `element.querySelector('.kintone-foo')`,
      errors: [
        {
          message:
            "Using internal kintone UI class name `kintone-foo` is not allowed.",
        },
      ],
    },
    {
      code: `element.querySelector('.foo > .kintone-foo')`,
      errors: [
        {
          message:
            "Using internal kintone UI class name `kintone-foo` is not allowed.",
        },
      ],
    },
    {
      code: `element.querySelectorAll('.kintone-foo')`,
      errors: [
        {
          message:
            "Using internal kintone UI class name `kintone-foo` is not allowed.",
        },
      ],
    },
    {
      code: `element.querySelectorAll('.foo.kintone-foo')`,
      errors: [
        {
          message:
            "Using internal kintone UI class name `kintone-foo` is not allowed.",
        },
      ],
    },
    {
      code: `element.getElementsByClassName('kintone-foo')`,
      errors: [
        {
          message:
            "Using internal kintone UI class name `kintone-foo` is not allowed.",
        },
      ],
    },
    {
      code: `element.getElementsByClassName('foo kintone-foo')`,
      errors: [
        {
          message:
            "Using internal kintone UI class name `kintone-foo` is not allowed.",
        },
      ],
    },
    {
      code: `$('.kintone-foo')`,
      errors: [
        {
          message:
            "Possible use of internal kintone UI class name `kintone-foo`.",
        },
      ],
    },
    {
      code: `$(document).on('click', '.kintone-foo', handler)`,
      errors: [
        {
          message:
            "Possible use of internal kintone UI class name `kintone-foo`.",
        },
      ],
    },
    // ocean-*
    {
      code: `element.querySelector('.ocean-foo')`,
      errors: [
        {
          message:
            "Using internal kintone UI class name `ocean-foo` is not allowed.",
        },
      ],
    },
    {
      code: `element.querySelector('.foo > .ocean-foo')`,
      errors: [
        {
          message:
            "Using internal kintone UI class name `ocean-foo` is not allowed.",
        },
      ],
    },
    {
      code: `element.querySelectorAll('.ocean-foo')`,
      errors: [
        {
          message:
            "Using internal kintone UI class name `ocean-foo` is not allowed.",
        },
      ],
    },
    {
      code: `element.querySelectorAll('.foo.ocean-foo')`,
      errors: [
        {
          message:
            "Using internal kintone UI class name `ocean-foo` is not allowed.",
        },
      ],
    },
    {
      code: `element.getElementsByClassName('ocean-foo')`,
      errors: [
        {
          message:
            "Using internal kintone UI class name `ocean-foo` is not allowed.",
        },
      ],
    },
    {
      code: `element.getElementsByClassName('foo ocean-foo')`,
      errors: [
        {
          message:
            "Using internal kintone UI class name `ocean-foo` is not allowed.",
        },
      ],
    },
    {
      code: `$('.ocean-foo')`,
      errors: [
        {
          message:
            "Possible use of internal kintone UI class name `ocean-foo`.",
        },
      ],
    },
    {
      code: `$(document).on('click', '.ocean-foo', handler)`,
      errors: [
        {
          message:
            "Possible use of internal kintone UI class name `ocean-foo`.",
        },
      ],
    },
  ],
});
