import * as kokomi from "kokomi.js";
import * as THREE from "three";
import gsap from "gsap";

import defaultVertexShader from "./shaders/vert.glsl";
import defaultFragmentShader from "./shaders/frag.glsl";

export interface CheckerboardTextConfig {
  scroller: any;
  textColor: string;
  shadowColor: string;
  textSpacing: number;
  grid: number[];
  font: string;
  elList: HTMLElement[];
}

export interface CheckerboardTextAnimeConfig {
  duration: number;
  delay: number;
  stagger: number;
}

class CheckerboardText extends kokomi.Component {
  mg: kokomi.MojiGroup;
  textColor: string;
  textSpacing: number;
  font: string;
  constructor(base: kokomi.Base, config: Partial<CheckerboardTextConfig> = {}) {
    super(base);

    const {
      scroller = new kokomi.NormalScroller(),
      shadowColor = "#03D8F3",
      textColor = "#ffffff",
      textSpacing = 0.05,
      grid = [3, 6],
      font = "",
      elList = [...document.querySelectorAll(".ct")],
    } = config;

    this.textColor = textColor;
    this.textSpacing = textSpacing;
    this.font = font;

    const mg = new kokomi.MojiGroup(base, {
      vertexShader: defaultVertexShader,
      fragmentShader: defaultFragmentShader,
      scroller,
      uniforms: {
        uProgress: {
          value: 0,
        },
        uProgress1: {
          value: 0,
        },
        uGrid: {
          value: new THREE.Vector2(grid[0], grid[1]),
        },
        uGridSize: {
          value: 1,
        },
        uShadowColor: {
          value: new THREE.Color(shadowColor),
        },
      },
      // @ts-ignore
      elList,
    });
    this.mg = mg;

    mg.container = this.container;
  }
  addExisting() {
    this.mg.addExisting();

    this.mg.mojis.forEach((moji) => {
      moji.textMesh.mesh.material.uniforms.uGridSize.value =
        moji.textMesh.mesh._private_text.length;

      moji.textMesh.mesh.letterSpacing = this.textSpacing;

      const color = moji.el.dataset["webglTextColor"] || this.textColor;
      moji.textMesh.mesh.material.uniforms.uTextColor.value = new THREE.Color(
        color
      );

      if (this.font) {
        moji.textMesh.mesh.font = this.font;
      }
    });
  }
  fadeIn(textClass: string, config: Partial<CheckerboardTextAnimeConfig> = {}) {
    const { duration = 1.6, stagger = 0.05, delay = 0 } = config;

    if (this.mg.mojis) {
      this.mg.mojis.forEach((moji) => {
        if (!moji.el.classList.contains(textClass)) {
          return;
        }
        const totalDuration = duration;
        const t1 = gsap.timeline();
        const uniforms = moji.textMesh.mesh.material.uniforms;
        t1.to(uniforms.uProgress, {
          value: 1,
          duration: totalDuration,
        });
        t1.to(
          uniforms.uProgress1,
          {
            value: 1,
            duration: totalDuration,
            delay,
          },
          stagger
        );
      });
    }
  }
  fadeOut(
    textClass: string,
    config: Partial<CheckerboardTextAnimeConfig> = {}
  ) {
    const { duration = 1.6, stagger = 0.05, delay = 0 } = config;

    if (this.mg.mojis) {
      this.mg.mojis.forEach((moji) => {
        if (!moji.el.classList.contains(textClass)) {
          return;
        }
        const totalDuration = duration;
        const t1 = gsap.timeline();
        const uniforms = moji.textMesh.mesh.material.uniforms;
        t1.to(uniforms.uProgress1, {
          value: 0,
          duration: totalDuration,
          delay,
        });
        t1.to(
          uniforms.uProgress,
          {
            value: 0,
            duration: totalDuration,
            delay,
          },
          stagger
        );
      });
    }
  }
}

export { CheckerboardText };
