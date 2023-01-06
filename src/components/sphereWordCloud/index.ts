import * as kokomi from "kokomi.js";
import * as THREE from "three";

import _ from "lodash";

export interface SphereWordCloudConfig {
  radius: number;
  segment: number;
  pointSize: number;
  pointOpacity: number;
  pointColor: string;
  lineOpacity: number;
  lineColor: string;
  baseClassName: string;
}

class SphereWordCloud extends kokomi.Component {
  points: THREE.Points;
  positions: THREE.Vector3[];
  htmls: kokomi.Html[];
  lines: THREE.Line[];
  lineOpacity: number;
  lineColor: string;
  baseClassName: string;
  constructor(base: kokomi.Base, config: Partial<SphereWordCloudConfig> = {}) {
    super(base);

    const {
      radius = 0.5,
      segment = 8,
      pointSize = 0.01,
      pointOpacity = 1,
      pointColor = "white",
      lineOpacity = 1,
      lineColor = "white",
      baseClassName = "point",
    } = config;

    this.lineOpacity = lineOpacity;
    this.lineColor = lineColor;
    this.baseClassName = baseClassName;

    const geometry = new THREE.SphereGeometry(radius, segment, segment);
    const material = new THREE.PointsMaterial({
      color: pointColor,
      size: pointSize,
      transparent: true,
      opacity: pointOpacity,
      depthWrite: false,
    });
    const points = new THREE.Points(geometry, material);
    this.points = points;

    this.positions = [];
    this.htmls = [];
    this.lines = [];

    this.getPositions();
  }
  addExisting(): void {
    this.container.add(this.points);
  }
  getPositions() {
    const positionAttribute = this.points.geometry.attributes.position;
    const positions = kokomi.convertBufferAttributeToVector(positionAttribute);
    const uniqPositions = _.uniqWith(positions, _.isEqual);
    this.positions = uniqPositions;
  }
  removeSomePositions() {
    this.positions = this.positions.filter((item) => {
      return !(
        Math.abs(item.x) === 0 ||
        item.z === 0 ||
        Math.abs(item.y) === 0.5
      );
    });
  }
  randomizePositions() {
    this.positions = this.positions.map((position) => {
      const offset = THREE.MathUtils.randFloat(0.4, 1);
      const offsetVector = new THREE.Vector3(offset, offset, offset);
      const targetPosition = position.multiply(offsetVector);
      return targetPosition;
    });
  }
  addHtmls() {
    const htmls = this.positions.map((position, i) => {
      const pointId = i + 1;
      const el = document.querySelector(
        `.${this.baseClassName}-${pointId}`
      ) as HTMLElement;
      const html = new kokomi.Html(this.base, el, position);
      return html;
    });
    this.htmls = htmls;
  }
  addLines() {
    const material = new THREE.LineBasicMaterial({
      color: this.lineColor,
      transparent: true,
      opacity: this.lineOpacity,
      depthWrite: false,
    });
    const lines = this.positions.map((position) => {
      const points = [this.points.position, position];
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(geometry, material);
      this.container.add(line);
      return line;
    });
    this.lines = lines;
  }
  listenForHoverHtml(onMouseOver: any, onMouseLeave: any) {
    this.htmls.forEach((html) => {
      html.el?.addEventListener("mouseover", () => {
        this.emit("mouseover", html.el);
      });
      html.el?.addEventListener("mouseleave", () => {
        this.emit("mouseleave", html.el);
      });
    });
    this.on("mouseover", (el: HTMLElement) => {
      onMouseOver(el);
    });
    this.on("mouseleave", (el: HTMLElement) => {
      onMouseLeave(el);
    });
  }
}

export { SphereWordCloud };
