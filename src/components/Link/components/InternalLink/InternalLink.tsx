import * as React from 'react';
import { connect } from 'react-redux';
import * as classNames from 'classnames';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import { AppState, layouts } from '@reducers/index';
import {
  PageTransitionStatus,
  startPageTransitionAction,
  finishPageTransitionAction,
} from '@actions/layouts';

// Get props from parent components
import { LinkProps } from '../../Link';

import './InternalLink.scss';

interface StateProps {
  pageTransitionStatus: string;
}

interface DispatchProps {
  startPageTransitionAction: () => void;
  finishPageTransitionAction: () => void;
}

type InternalLinkProps = StateProps & DispatchProps & LinkProps & RouteComponentProps<{}>;

class InternalLink extends React.Component<InternalLinkProps> {
  static defaultProps = {
    onMouseEnter: (evt?: React.MouseEvent<any>) => {},
    onMouseLeave: (evt?: React.MouseEvent<any>) => {},
    onClick: (evt?: React.MouseEvent<any>) => {},
  };

  state = {
    clicked: false
  };

  componentWillReceiveProps(nextProps: InternalLinkProps) {
    const transitionPaused = this.props.pageTransitionStatus === PageTransitionStatus.START
      && nextProps.pageTransitionStatus === PageTransitionStatus.MIDDLE;

    // If the InternalLink has been clicked on and if the transitionLayer is paused
    if (this.state.clicked &&  transitionPaused) {
      this.props.history.push(this.props.to);
      this.props.finishPageTransitionAction();
      this.setState({ clicked: false });

      // Execute onClick event passed from Link component's props
      if (this.props.onClick) {
        this.props.onClick();
      }
    }
  }

  render() {
    const { className, children, onMouseEnter, onMouseLeave } = this.props;
    const internalLinkClasses = classNames('InternalLink', className);

    return (
      <div
        className={internalLinkClasses}
        onClick={this.handleClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {children}
      </div>
    );
  }

  handleClick = (evt: React.MouseEvent<any>) => {
    this.setState({ clicked: true });
    this.props.startPageTransitionAction();
  }
}

const mapStateToProps = (state: AppState) => ({
  pageTransitionStatus: layouts.getPageTransitionStatus(state),
});

const mapDispatchToProps = {
  startPageTransitionAction,
  finishPageTransitionAction,
};

const ConnectedInternalLink = connect<StateProps, DispatchProps, LinkProps>(
  mapStateToProps,
  mapDispatchToProps
)(InternalLink);

export default withRouter(ConnectedInternalLink);